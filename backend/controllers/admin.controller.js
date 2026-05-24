// import User from "../models/user.js";
// import Campaign from "../models/campaign.js";
// import Donation from "../models/donation.js";
// import CampaignerRequest from "../models/campaignerRequest.js";
// import createNotification from "../utils/createNotification.js";
// import sendEmail from "../utils/sendEmail.js";

// // ─── Campaigner Requests ────────────────────────────────────────────────────

// // GET /api/admin/campaigner-requests
// export const getCampaignerRequests = async (req, res, next) => {
//   try {
//     const { status = "pending" } = req.query;
//     const requests = await CampaignerRequest.find({ status })
//       .populate("userId", "name email role")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({ requests });
//   } catch (error) {
//     next(error);
//   }
// };

// // PUT /api/admin/campaigner/:id/approve
// export const approveCampaigner = async (req, res, next) => {
//   try {
//     const request = await CampaignerRequest.findById(req.params.id);
//     if (!request) return res.status(404).json({ message: "Request not found" });
//     if (request.status !== "pending") {
//       return res.status(400).json({ message: "Request already processed" });
//     }

//     request.status = "approved";
//     await request.save();

//     const user = await User.findById(request.userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.role = "campaigner";
//     user.isVerifiedCampaigner = true;
//     await user.save();

//     await createNotification({
//       user: user._id,
//       title: "Campaigner application approved! 🎉",
//       message:
//         "Congratulations! Your application has been approved. You can now create campaigns.",
//       type: "admin",
//     });

//     sendEmail({
//       to: user.email,
//       subject: "Your PawRescue Campaigner application is approved!",
//       html: `
//         <h2>Congratulations, ${user.name}! 🎉</h2>
//         <p>Your campaigner application has been approved. You can now create campaigns on PawRescue.</p>
//         <p>Log in to your account to get started.</p>
//       `,
//     });

//     return res
//       .status(200)
//       .json({ message: "Campaigner approved", request, user });
//   } catch (error) {
//     next(error);
//   }
// };

// // PUT /api/admin/campaigner/:id/reject
// export const rejectCampaigner = async (req, res, next) => {
//   try {
//     const { reason } = req.body;

//     const request = await CampaignerRequest.findById(req.params.id);
//     if (!request) return res.status(404).json({ message: "Request not found" });
//     if (request.status !== "pending") {
//       return res.status(400).json({ message: "Request already processed" });
//     }

//     request.status = "rejected";
//     await request.save();

//     const user = await User.findById(request.userId);
//     if (user) {
//       await createNotification({
//         user: user._id,
//         title: "Campaigner application rejected",
//         message:
//           reason ||
//           "Your application was reviewed and could not be approved at this time.",
//         type: "admin",
//       });

//       sendEmail({
//         to: user.email,
//         subject: "PawRescue Campaigner application update",
//         html: `
//           <h2>Hi ${user.name},</h2>
//           <p>Unfortunately, your campaigner application has been rejected.</p>
//           ${reason ? `<p>Reason: ${reason}</p>` : ""}
//           <p>You may apply again after addressing the concerns.</p>
//         `,
//       });
//     }

//     return res
//       .status(200)
//       .json({ message: "Campaigner request rejected", request });
//   } catch (error) {
//     next(error);
//   }
// };

// // ─── Campaign Approval ───────────────────────────────────────────────────────

// // GET /api/admin/campaigns/pending
// export const getPendingCampaigns = async (req, res, next) => {
//   try {
//     const campaigns = await Campaign.find({ status: "pending" })
//       .populate("creator", "name email")
//       .sort({ createdAt: -1 });

//     return res.status(200).json({ campaigns });
//   } catch (error) {
//     next(error);
//   }
// };

// // PUT /api/admin/campaigns/:id/approve
// export const approveCampaign = async (req, res, next) => {
//   try {
//     const campaign = await Campaign.findById(req.params.id).populate(
//       "creator",
//       "name email",
//     );
//     if (!campaign)
//       return res.status(404).json({ message: "Campaign not found" });
//     if (campaign.status !== "pending") {
//       return res.status(400).json({ message: "Campaign is not pending" });
//     }

//     campaign.status = "approved";
//     await campaign.save();

//     await createNotification({
//       user: campaign.creator._id,
//       title: "Campaign approved! 🎉",
//       message: `Your campaign "${campaign.title}" has been approved and is now live.`,
//       type: "admin",
//       campaign: campaign._id,
//     });

//     sendEmail({
//       to: campaign.creator.email,
//       subject: `Your campaign "${campaign.title}" is now live!`,
//       html: `
//         <h2>Great news, ${campaign.creator.name}! 🐾</h2>
//         <p>Your campaign <strong>"${campaign.title}"</strong> has been approved and is now visible to donors.</p>
//         <p>Share the campaign link to get more donations!</p>
//       `,
//     });

//     return res.status(200).json({ message: "Campaign approved", campaign });
//   } catch (error) {
//     next(error);
//   }
// };

// // PUT /api/admin/campaigns/:id/reject
// export const rejectCampaign = async (req, res, next) => {
//   try {
//     const { reason } = req.body;

//     const campaign = await Campaign.findById(req.params.id).populate(
//       "creator",
//       "name email",
//     );
//     if (!campaign)
//       return res.status(404).json({ message: "Campaign not found" });
//     if (campaign.status !== "pending") {
//       return res.status(400).json({ message: "Campaign is not pending" });
//     }

//     campaign.status = "rejected";
//     await campaign.save();

//     await createNotification({
//       user: campaign.creator._id,
//       title: "Campaign rejected",
//       message:
//         reason ||
//         `Your campaign "${campaign.title}" was reviewed and could not be approved.`,
//       type: "admin",
//       campaign: campaign._id,
//     });

//     sendEmail({
//       to: campaign.creator.email,
//       subject: `Campaign "${campaign.title}" update`,
//       html: `
//         <h2>Hi ${campaign.creator.name},</h2>
//         <p>Your campaign <strong>"${campaign.title}"</strong> has been rejected.</p>
//         ${reason ? `<p>Reason: ${reason}</p>` : ""}
//       `,
//     });

//     return res.status(200).json({ message: "Campaign rejected", campaign });
//   } catch (error) {
//     next(error);
//   }
// };

// // PUT /api/admin/campaigns/:id/urgent
// export const markCampaignUrgent = async (req, res, next) => {
//   try {
//     const { urgencyLevel } = req.body;
//     if (
//       !urgencyLevel ||
//       !["normal", "critical", "surgery"].includes(urgencyLevel)
//     ) {
//       return res.status(400).json({
//         message: "Valid urgency level required: normal, critical, surgery",
//       });
//     }

//     const campaign = await Campaign.findById(req.params.id);
//     if (!campaign)
//       return res.status(404).json({ message: "Campaign not found" });

//     campaign.urgencyLevel = urgencyLevel;
//     await campaign.save();

//     // If marked urgent, notify existing donors
//     if (urgencyLevel === "urgent") {
//       const donorIds = await Donation.find({
//         campaign: campaign._id,
//         status: "success",
//       }).distinct("donor");

//       await Promise.all(
//         donorIds.map((donorId) =>
//           createNotification({
//             user: donorId,
//             title: `🚨 Urgent: Needs Immediate Help`,
//             message: `Campaign "${campaign.title}" has been marked as Urgent. Consider donating more.`,
//             type: "urgent",
//             campaign: campaign._id,
//           }),
//         ),
//       );
//     }

//     return res.status(200).json({ message: "Urgency level updated", campaign });
//   } catch (error) {
//     next(error);
//   }
// };

// // ─── Stats ────────────────────────────────────────────────────────────────────

// // GET /api/admin/stats
// export const getAdminStats = async (req, res, next) => {
//   try {
//     const [
//       totalUsers,
//       totalCampaigns,
//       donationAgg,
//       pendingCampaigns,
//       pendingCampaignerRequests,
//     ] = await Promise.all([
//       User.countDocuments(),
//       Campaign.countDocuments(),
//       Donation.aggregate([
//         { $match: { status: "success" } },
//         {
//           $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } },
//         },
//       ]),
//       Campaign.countDocuments({ status: "pending" }),
//       CampaignerRequest.countDocuments({ status: "pending" }),
//     ]);

//     const totalDonations = donationAgg[0]?.count || 0;
//     const fundsRaised = donationAgg[0]?.total || 0;

//     return res.status(200).json({
//       totalUsers,
//       totalCampaigns,
//       totalDonations,
//       fundsRaised,
//       pendingCampaigns,
//       pendingCampaignerRequests,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // ─── User Management ─────────────────────────────────────────────────────────

// // GET /api/admin/users
// export const getAllUsers = async (req, res, next) => {
//   try {
//     const { role, search } = req.query;
//     const query = {};
//     if (role) query.role = role;
//     if (search) query.name = { $regex: search, $options: "i" };

//     const users = await User.find(query).sort({ createdAt: -1 });
//     return res.status(200).json({ users });
//   } catch (error) {
//     next(error);
//   }
// };

// // PUT /api/admin/users/:id/role
// export const changeUserRole = async (req, res, next) => {
//   try {
//     const { role } = req.body;
//     if (!role || !["donor", "campaigner", "admin"].includes(role)) {
//       return res
//         .status(400)
//         .json({ message: "Valid role required: donor, campaigner, admin" });
//     }
//     if (req.params.id === req.user._id.toString()) {
//       return res
//         .status(400)
//         .json({ message: "You cannot change your own role" });
//     }

//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     user.role = role;
//     if (role === "campaigner") user.isVerifiedCampaigner = true;
//     if (role === "donor") user.isVerifiedCampaigner = false;

//     await user.save();

//     await createNotification({
//       user: user._id,
//       title: "Account role updated",
//       message: `Your account role has been changed to ${role} by an admin.`,
//       type: "admin",
//     });

//     return res.status(200).json({ message: "User role updated", user });
//   } catch (error) {
//     next(error);
//   }
// };




import User from "../models/user.js";
import Campaign from "../models/campaign.js";
import Donation from "../models/donation.js";
import CampaignerRequest from "../models/campaignerRequest.js";
import createNotification from "../utils/createNotification.js";
import sendEmail from "../utils/sendEmail.js";

// ─── Campaigner Requests ─────────────────────────────────────────────────────

// GET /api/admin/campaigner-requests
export const getCampaignerRequests = async (req, res, next) => {
  try {
    const { status = "pending" } = req.query;
    const requests = await CampaignerRequest.find({ status })
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({ requests });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/campaigner/:id/approve
export const approveCampaigner = async (req, res, next) => {
  try {
    const request = await CampaignerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "approved";
    await request.save();

    const user = await User.findById(request.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "campaigner";
    user.isVerifiedCampaigner = true;
    await user.save();

    await createNotification({
      user: user._id,
      title: "Campaigner application approved! 🎉",
      message: "Congratulations! Your application has been approved. You can now create campaigns.",
      type: "admin",
    });

    sendEmail({
      to: user.email,
      subject: "Your PawRescue Campaigner application is approved!",
      html: `
        <h2>Congratulations, ${user.name}! 🎉</h2>
        <p>Your campaigner application has been approved. You can now create campaigns on PawRescue.</p>
        <p>Log in to your account to get started.</p>
      `,
    });

    return res.status(200).json({ message: "Campaigner approved", request, user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/campaigner/:id/reject
export const rejectCampaigner = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const request = await CampaignerRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.status = "rejected";
    await request.save();

    const user = await User.findById(request.userId);
    if (user) {
      await createNotification({
        user: user._id,
        title: "Campaigner application rejected",
        message: reason || "Your application was reviewed and could not be approved at this time.",
        type: "admin",
      });

      sendEmail({
        to: user.email,
        subject: "PawRescue Campaigner application update",
        html: `
          <h2>Hi ${user.name},</h2>
          <p>Unfortunately, your campaigner application has been rejected.</p>
          ${reason ? `<p>Reason: ${reason}</p>` : ""}
          <p>You may apply again after addressing the concerns.</p>
        `,
      });
    }

    return res.status(200).json({ message: "Campaigner request rejected", request });
  } catch (error) {
    next(error);
  }
};

// ─── Campaign Approval ───────────────────────────────────────────────────────

// GET /api/admin/campaigns/pending
export const getPendingCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ status: "pending" })
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ campaigns });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/campaigns/:id/approve
export const approveCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("creator", "name email");
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    if (campaign.status !== "pending") {
      return res.status(400).json({ message: "Campaign is not pending" });
    }

    campaign.status = "approved";
    await campaign.save();

    await createNotification({
      user: campaign.creator._id,
      title: "Campaign approved! 🎉",
      message: `Your campaign "${campaign.title}" has been approved and is now live.`,
      type: "admin",
      campaign: campaign._id,
    });

    sendEmail({
      to: campaign.creator.email,
      subject: `Your campaign "${campaign.title}" is now live!`,
      html: `
        <h2>Great news, ${campaign.creator.name}! 🐾</h2>
        <p>Your campaign <strong>"${campaign.title}"</strong> has been approved and is now visible to donors.</p>
        <p>Share the campaign link to get more donations!</p>
      `,
    });

    return res.status(200).json({ message: "Campaign approved", campaign });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/campaigns/:id/reject
export const rejectCampaign = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const campaign = await Campaign.findById(req.params.id).populate("creator", "name email");
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    if (campaign.status !== "pending") {
      return res.status(400).json({ message: "Campaign is not pending" });
    }

    campaign.status = "rejected";
    await campaign.save();

    await createNotification({
      user: campaign.creator._id,
      title: "Campaign rejected",
      message: reason || `Your campaign "${campaign.title}" was reviewed and could not be approved.`,
      type: "admin",
      campaign: campaign._id,
    });

    sendEmail({
      to: campaign.creator.email,
      subject: `Campaign "${campaign.title}" update`,
      html: `
        <h2>Hi ${campaign.creator.name},</h2>
        <p>Your campaign <strong>"${campaign.title}"</strong> has been rejected.</p>
        ${reason ? `<p>Reason: ${reason}</p>` : ""}
      `,
    });

    return res.status(200).json({ message: "Campaign rejected", campaign });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/campaigns/:id/urgent
export const markCampaignUrgent = async (req, res, next) => {
  try {
    const { urgencyLevel } = req.body;
    if (!urgencyLevel || !["normal", "urgent"].includes(urgencyLevel)) {
      return res.status(400).json({ message: "Valid urgency level required: normal, urgent" });
    }

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    campaign.urgencyLevel = urgencyLevel;
    await campaign.save();

    // If marked urgent, notify existing donors
    if (urgencyLevel === "urgent") {
      const donorIds = await Donation.find({
        campaign: campaign._id,
        status: "success",
      }).distinct("donor");

      await Promise.all(
        donorIds.map((donorId) =>
          createNotification({
            user: donorId,
            title: `🚨 Urgent: Needs Immediate Help`,
            message: `Campaign "${campaign.title}" has been marked as Urgent. Consider donating more.`,
            type: "urgent",
            campaign: campaign._id,
          })
        )
      );
    }

    return res.status(200).json({ message: "Urgency level updated", campaign });
  } catch (error) {
    next(error);
  }
};

// ─── Stats ────────────────────────────────────────────────────────────────────

// GET /api/admin/stats
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCampaigns,
      donationAgg,
      pendingCampaigns,
      pendingCampaignerRequests,
      recentDonations,
    ] = await Promise.all([
      User.countDocuments(),
      Campaign.countDocuments(),
      Donation.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      ]),
      Campaign.countDocuments({ status: "pending" }),
      CampaignerRequest.countDocuments({ status: "pending" }),
      Donation.find({ status: "success" }).sort({ createdAt: -1 }).populate("donor", "name email").populate("campaign", "title").lean(),
    ]);

    const totalDonations = donationAgg[0]?.count || 0;
    const fundsRaised = donationAgg[0]?.total || 0;

    return res.status(200).json({
      totalUsers,
      totalCampaigns,
      totalDonations,
      fundsRaised,
      pendingCampaigns,
      pendingCampaignerRequests,
      recentDonations,
    });
  } catch (error) {
    next(error);
  }
};

// ─── User Management ─────────────────────────────────────────────────────────

// GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.name = { $regex: search, $options: "i" };

    const users = await User.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/role
export const changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role || !["donor", "campaigner", "admin"].includes(role)) {
      return res.status(400).json({ message: "Valid role required: donor, campaigner, admin" });
    }
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    if (role === "campaigner") user.isVerifiedCampaigner = true;
    if (role === "donor") user.isVerifiedCampaigner = false;

    await user.save();

    await createNotification({
      user: user._id,
      title: "Account role updated",
      message: `Your account role has been changed to ${role} by an admin.`,
      type: "admin",
    });

    return res.status(200).json({ message: "User role updated", user });
  } catch (error) {
    next(error);
  }
};