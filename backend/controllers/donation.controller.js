// import razorpay from "../config/razorpay.js";
// import Donation from "../models/Donation.js";
// import Campaign from "../models/Campaign.js";
// import User from "../models/user.js";
// import verifyRazorpaySignature from "../utils/verifyRazorpaySignature.js";
// import assignCoupon from "../utils/assignCoupon.js";
// import createNotification from "../utils/createNotification.js";
// import sendEmail from "../utils/sendEmail.js";

// // POST /api/donations/create-order
// export const createOrder = async (req, res, next) => {
//   try {
//     const { campaignId, amount, message, isAnonymous } = req.body;

//     if (!campaignId || !amount) {
//       return res
//         .status(400)
//         .json({ message: "Campaign ID and amount are required" });
//     }
//     if (Number(amount) < 1) {
//       return res.status(400).json({ message: "Minimum donation amount is ₹1" });
//     }

//     const campaign = await Campaign.findById(campaignId);
//     if (!campaign)
//       return res.status(404).json({ message: "Campaign not found" });
//     if (campaign.status !== "approved") {
//       return res
//         .status(400)
//         .json({ message: "Campaign is not accepting donations" });
//     }

//     // Create Razorpay order (amount in paise)
//     const order = await razorpay.orders.create({
//       amount: Math.round(Number(amount) * 100),
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     });

//     // Save a pending donation
//     const donation = await Donation.create({
//       campaign: campaignId,
//       donor: req.user._id,
//       amount: Number(amount),
//       message: message || "",
//       isAnonymous: Boolean(isAnonymous),
//       razorpayOrderId: order.id,
//       status: "pending",
//     });

//     return res.status(201).json({
//       message: "Order created",
//       order,
//       donationId: donation._id,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // POST /api/donations/confirm
// export const confirmDonation = async (req, res, next) => {
//   try {
//     const {
//       donationId,
//       razorpayOrderId,
//       razorpayPaymentId,
//       razorpaySignature,
//     } = req.body;

//     if (
//       !donationId ||
//       !razorpayOrderId ||
//       !razorpayPaymentId ||
//       !razorpaySignature
//     ) {
//       return res
//         .status(400)
//         .json({ message: "All payment details are required" });
//     }

//     const donation = await Donation.findById(donationId);
//     if (!donation)
//       return res.status(404).json({ message: "Donation not found" });
//     if (donation.status === "success") {
//       return res.status(409).json({ message: "Donation already confirmed" });
//     }
//     if (donation.donor.toString() !== req.user._id.toString()) {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     // Verify Razorpay signature
//     const isValid = verifyRazorpaySignature({
//       razorpayOrderId,
//       razorpayPaymentId,
//       razorpaySignature,
//     });

//     if (!isValid) {
//       donation.status = "failed";
//       await donation.save();
//       return res
//         .status(400)
//         .json({ message: "Payment signature verification failed" });
//     }

//     // Mark donation successful
//     donation.status = "success";
//     donation.razorpayPaymentId = razorpayPaymentId;
//     donation.razorpayOrderId = razorpayOrderId;
//     donation.razorpaySignature = razorpaySignature;
//     await donation.save();

//     // Update campaign raisedAmount and donations array
//     const campaign = await Campaign.findById(donation.campaign);
//     campaign.raisedAmount += donation.amount;
//     campaign.donations.push(donation._id);

//     // Mark complete if goal reached
//     if (campaign.raisedAmount >= campaign.goalAmount) {
//       campaign.status = "completed";
//     }
//     await campaign.save();

//     // Assign coupon if eligible
//     const coupon = await assignCoupon(
//       req.user._id,
//       donation.amount,
//       donation._id,
//     );

//     // Notify campaign creator
//     await createNotification({
//       user: campaign.creator,
//       title: "New donation received!",
//       message: `Someone donated ₹${donation.amount} to "${campaign.title}"`,
//       type: "donation",
//       campaign: campaign._id,
//     });

//     // Notify donor
//     await createNotification({
//       user: req.user._id,
//       title: "Donation confirmed 💚",
//       message: `Your donation of ₹${donation.amount} to "${campaign.title}" was successful.`,
//       type: "donation",
//       campaign: campaign._id,
//     });

//     // Send confirmation email to donor
//     const donor = await User.findById(req.user._id);
//     sendEmail({
//       to: donor.email,
//       subject: `Donation confirmed — ${campaign.title}`,
//       html: `
//         <h2>Thank you, ${donor.name}! 🐾</h2>
//         <p>Your donation of <strong>₹${donation.amount}</strong> to <strong>${campaign.title}</strong> has been confirmed.</p>
//         ${coupon ? `<p>🎉 You earned a coupon: <strong>${coupon.code}</strong> — ${coupon.discount}% off your next order!</p>` : ""}
//         <p>Every rupee helps save a life. Thank you for being a hero.</p>
//       `,
//     });

//     return res.status(200).json({
//       message: "Donation confirmed successfully",
//       donation,
//       coupon: coupon || null,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // GET /api/users/me/donations
// export const getMyDonations = async (req, res, next) => {
//   try {
//     const donations = await Donation.find({
//       donor: req.user._id,
//       status: "success",
//     })
//       .sort({ createdAt: -1 })
//       .populate("campaign", "title coverImage category urgencyLevel status")
//       .lean();

//     return res.status(200).json({ donations });
//   } catch (error) {
//     next(error);
//   }
// };

// // GET /api/users/me/coupons
// export const getMyCoupons = async (req, res, next) => {
//   try {
//     const { default: Coupon } = await import("../models/Coupon.js");
//     const coupons = await Coupon.find({ user: req.user._id })
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.status(200).json({ coupons });
//   } catch (error) {
//     next(error);
//   }
// };




import razorpay from "../config/razorpay.js";
import Donation from "../models/Donation.js";
import Campaign from "../models/Campaign.js";
import User from "../models/user.js";
import verifyRazorpaySignature from "../utils/verifyRazorpaySignature.js";
import createNotification from "../utils/createNotification.js";
import sendEmail from "../utils/sendEmail.js";

// POST /api/donations/create-order
export const createOrder = async (req, res, next) => {
  try {
    const { campaignId, amount, message, isAnonymous } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({ message: "Campaign ID and amount are required" });
    }
    if (Number(amount) < 1) {
      return res.status(400).json({ message: "Minimum donation amount is ₹1" });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    if (campaign.status !== "approved") {
      return res.status(400).json({ message: "Campaign is not accepting donations" });
    }

    // Create Razorpay order (amount in paise)
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save a pending donation
    const donation = await Donation.create({
      campaign: campaignId,
      donor: req.user._id,
      amount: Number(amount),
      message: message || "",
      isAnonymous: Boolean(isAnonymous),
      razorpayOrderId: order.id,
      status: "pending",
    });

    return res.status(201).json({
      message: "Order created",
      order,
      donationId: donation._id,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/donations/confirm
export const confirmDonation = async (req, res, next) => {
  try {
    const { donationId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!donationId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "All payment details are required" });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    if (donation.status === "success") {
      return res.status(409).json({ message: "Donation already confirmed" });
    }
    if (donation.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Verify Razorpay signature
    const isValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    if (!isValid) {
      donation.status = "failed";
      await donation.save();
      return res.status(400).json({ message: "Payment signature verification failed" });
    }

    // Mark donation successful
    donation.status = "success";
    donation.razorpayPaymentId = razorpayPaymentId;
    donation.razorpayOrderId = razorpayOrderId;
    donation.razorpaySignature = razorpaySignature;
    await donation.save();

    // Update campaign raisedAmount and donations array
    const campaign = await Campaign.findById(donation.campaign);
    campaign.raisedAmount += donation.amount;
    campaign.donations.push(donation._id);

    // Mark complete if goal reached
    if (campaign.raisedAmount >= campaign.goalAmount) {
      campaign.status = "completed";
    }
    await campaign.save();

    // Notify campaign creator
    await createNotification({
      user: campaign.creator,
      title: "New donation received!",
      message: `Someone donated ₹${donation.amount} to "${campaign.title}"`,
      type: "donation",
      campaign: campaign._id,
    });

    // Notify donor
    await createNotification({
      user: req.user._id,
      title: "Donation confirmed 💚",
      message: `Your donation of ₹${donation.amount} to "${campaign.title}" was successful.`,
      type: "donation",
      campaign: campaign._id,
    });

    // Send confirmation email to donor
    const donor = await User.findById(req.user._id);
    sendEmail({
      to: donor.email,
      subject: `Donation confirmed — ${campaign.title}`,
      html: `
        <h2>Thank you, ${donor.name}! 🐾</h2>
        <p>Your donation of <strong>₹${donation.amount}</strong> to <strong>${campaign.title}</strong> has been confirmed.</p>
        <p>Every rupee helps save a life. Thank you for being a hero.</p>
      `,
    });

    return res.status(200).json({
      message: "Donation confirmed successfully",
      donation,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/me/donations
export const getMyDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({
      donor: req.user._id,
      status: "success",
    })
      .sort({ createdAt: -1 })
      .populate("campaign", "title coverImage category urgencyLevel status")
      .lean();

    return res.status(200).json({ donations });
  } catch (error) {
    next(error);
  }
};