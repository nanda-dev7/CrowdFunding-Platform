import mongoose from "mongoose";
import CampaignerRequest from "../Models/CampaignerRequest.js";
import Campaign from "../Models/CampaignModel.js";
import Donation from "../Models/DonationModel.js";
import User from "../Models/UserModel.js";
import createNotification from "./notification.controller.js";

const { isValidObjectId } = mongoose;
const NOTIFY_URGENT_LEVELS = new Set(["critical", "surgery"]);

export const getCampaignerRequests = async (req, res) => {
  try {
    const requests = await CampaignerRequest.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    console.error("Fetch campaigner requests error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveCampaignerRequest = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid request id" });
    }

    const request = await CampaignerRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = "approved";
    await request.save();

    const user = await User.findById(request.userId);
    if (user) {
      user.role = "campaigner";
      user.isVerifiedCampaigner = true;
      await user.save();

      await createNotification({
        user: user._id,
        title: "Campaigner application approved",
        message: "Your campaigner request has been approved. You can now create campaigns.",
        type: "admin",
      });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    console.error("Approve campaigner request error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectCampaignerRequest = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid request id" });
    }

    const request = await CampaignerRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    const user = await User.findById(request.userId);
    if (user) {
      await createNotification({
        user: user._id,
        title: "Campaigner application rejected",
        message: "Your campaigner request has been rejected. Please review your submission and try again.",
        type: "admin",
      });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    console.error("Reject campaigner request error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPendingCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" })
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error) {
    console.error("Fetch pending campaigns error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveCampaign = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid campaign id" });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    campaign.status = "approved";
    await campaign.save();

    await createNotification({
      user: campaign.creator,
      title: "Campaign approved",
      message: `Your campaign "${campaign.title}" has been approved and is now live.`,
      type: "admin",
      campaign: campaign._id,
    });

    res.json({ success: true, data: campaign });
  } catch (error) {
    console.error("Approve campaign error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectCampaign = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid campaign id" });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    campaign.status = "rejected";
    await campaign.save();

    await createNotification({
      user: campaign.creator,
      title: "Campaign rejected",
      message: `Your campaign "${campaign.title}" has been rejected by the admin team.`,
      type: "admin",
      campaign: campaign._id,
    });

    res.json({ success: true, data: campaign });
  } catch (error) {
    console.error("Reject campaign error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCampaignUrgency = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid campaign id" });
    }

    const { urgencyLevel } = req.body;
    if (!urgencyLevel || !["normal", "critical", "surgery"].includes(urgencyLevel)) {
      return res.status(400).json({
        success: false,
        message: "urgencyLevel must be one of normal, critical, or surgery",
      });
    }

    const campaign = await Campaign.findById(req.params.id).populate({
      path: "donations",
      select: "donor status",
      populate: { path: "donor", select: "_id" },
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    campaign.urgencyLevel = urgencyLevel;
    await campaign.save();

    if (NOTIFY_URGENT_LEVELS.has(urgencyLevel)) {
      const donorIds = [
        ...new Set(
          campaign.donations
            .filter((donation) => donation.status === "success" && donation.donor)
            .map((donation) => donation.donor._id.toString())
        ),
      ];

      await Promise.allSettled(
        donorIds.map((donorId) =>
          createNotification({
            user: donorId,
            title: `Urgent update for ${campaign.title}`,
            message: `The campaign has been marked as ${urgencyLevel}. Please check the campaign page for details.`,
            type: "urgent",
            campaign: campaign._id,
          })
        )
      );
    }

    res.json({ success: true, data: campaign });
  } catch (error) {
    console.error("Update campaign urgency error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const totalDonations = await Donation.countDocuments({ status: "success" });

    const donationAggregate = await Donation.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const fundsRaised = donationAggregate[0]?.total || 0;
    const pendingCampaigns = await Campaign.countDocuments({ status: "pending" });
    const pendingCampaignerRequests = await CampaignerRequest.countDocuments({ status: "pending" });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalCampaigns,
        totalDonations,
        fundsRaised,
        pendingCampaigns,
        pendingCampaignerRequests,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-passwordHash -refreshToken")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid user id" });
    }

    const { role } = req.body;
    if (!role || !["donor", "campaigner", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "role must be one of donor, campaigner, or admin",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.role = role;
    user.isVerifiedCampaigner = role === "campaigner";
    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
