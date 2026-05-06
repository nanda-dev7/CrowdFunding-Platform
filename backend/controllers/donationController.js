import Donation from "../models/DonationModel.js";
import Campaign from "../models/CampaignModel.js";
import User from "../models/UserModel.js";
import razorpay from "../config/razorpay.js";
import verifyRazorpaySignature from "../utils/verifyRazorpaySignature.js";

// Helper function to send response
const sendResponse = (res, statusCode, success, message, data = {}) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

/**
 * POST /api/donations/create-order
 * Create a Razorpay order for donation
 */
export const createOrder = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;
    const userId = req.user._id || req.user.id;

    // Validate input
    if (!campaignId || !amount) {
      return sendResponse(
        res,
        400,
        false,
        "Campaign ID and amount are required"
      );
    }

    if (amount <= 0) {
      return sendResponse(res, 400, false, "Amount must be greater than 0");
    }

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return sendResponse(res, 404, false, "Campaign not found");
    }

    // Check if campaign is approved
    if (campaign.status !== "approved") {
      return sendResponse(
        res,
        400,
        false,
        "Campaign is not approved for donations"
      );
    }

    // Convert amount to paise for Razorpay
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        campaignId: campaignId,
        userId: userId.toString(),
      },
    });

    // Create pending donation record
    const donation = await Donation.create({
      campaign: campaignId,
      donor: userId,
      amount: amount,
      status: "pending",
      razorpayOrderId: order.id,
    });

    return sendResponse(res, 200, true, "Order created successfully", {
      orderId: order.id,
      amount: amount,
      currency: "INR",
      donationId: donation._id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * POST /api/donations/confirm
 * Confirm payment and update campaign
 */
export const confirmDonation = async (req, res) => {
  try {
    const { donationId, razorpayPaymentId, razorpaySignature } = req.body;
    const userId = req.user._id || req.user.id;

    // Validate input
    if (!donationId || !razorpayPaymentId || !razorpaySignature) {
      return sendResponse(
        res,
        400,
        false,
        "Missing required payment details"
      );
    }

    // Find pending donation
    const donation = await Donation.findById(donationId).populate(
      "campaign donor"
    );
    if (!donation) {
      return sendResponse(res, 404, false, "Donation not found");
    }

    // Verify donation belongs to current user
    if (donation.donor._id.toString() !== userId.toString()) {
      return sendResponse(res, 403, false, "Unauthorized access");
    }

    // Verify donation is pending
    if (donation.status !== "pending") {
      return sendResponse(
        res,
        400,
        false,
        "Donation is not in pending state"
      );
    }

    // Verify Razorpay signature
    const isSignatureValid = verifyRazorpaySignature(
      donation.razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isSignatureValid) {
      donation.status = "failed";
      await donation.save();
      return sendResponse(res, 400, false, "Invalid payment signature");
    }

    // Update donation as success
    donation.razorpayPaymentId = razorpayPaymentId;
    donation.razorpaySignature = razorpaySignature;
    donation.status = "success";
    await donation.save();

    // Update campaign raised amount
    const campaign = donation.campaign;
    campaign.raisedAmount = (campaign.raisedAmount || 0) + donation.amount;

    // Add donation to campaign's donations array if it exists
    if (!campaign.donations) {
      campaign.donations = [];
    }
    campaign.donations.push(donation._id);

    await campaign.save();

    return sendResponse(res, 200, true, "Payment confirmed successfully", {
      donation: {
        id: donation._id,
        amount: donation.amount,
        status: donation.status,
        campaign: campaign._id,
      },
      campaignUpdated: {
        raisedAmount: campaign.raisedAmount,
      },
    });
  } catch (error) {
    console.error("Error confirming donation:", error);
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * GET /api/users/me/donations
 * Get all donations made by the logged-in user
 */
export const getUserDonations = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const donations = await Donation.find({ donor: userId })
      .populate({
        path: "campaign",
        select: "title category goalAmount raisedAmount",
      })
      .sort({ createdAt: -1 });

    return sendResponse(res, 200, true, "Donations retrieved successfully", {
      donations,
      total: donations.length,
    });
  } catch (error) {
    console.error("Error retrieving donations:", error);
    return sendResponse(res, 500, false, error.message);
  }
};

/**
 * GET /api/donations/:donationId
 * Get specific donation details
 */
export const getDonationById = async (req, res) => {
  try {
    const { donationId } = req.params;
    const userId = req.user._id || req.user.id;

    const donation = await Donation.findById(donationId)
      .populate({
        path: "campaign",
        select: "title description category goalAmount raisedAmount",
      })
      .populate({
        path: "donor",
        select: "name email",
      });

    if (!donation) {
      return sendResponse(res, 404, false, "Donation not found");
    }

    // Check if user is authorized to view this donation
    if (
      donation.donor._id.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return sendResponse(res, 403, false, "Unauthorized access");
    }

    return sendResponse(res, 200, true, "Donation retrieved successfully", {
      donation,
    });
  } catch (error) {
    console.error("Error retrieving donation:", error);
    return sendResponse(res, 500, false, error.message);
  }
};
