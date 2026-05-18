// import Campaign from "../models/Campaign.js";
// import uploadToCloudinary from "../utils/uploadToCloudinary.js";
// import createNotification from "../utils/createNotification.js";
// import Donation from "../models/Donation.js";

// // GET /api/campaigns
// export const getCampaigns = async (req, res, next) => {
//   try {
//     const { category, urgencyLevel, sort } = req.query;

//     const query = { status: "approved" };
//     if (category) query.category = category;
//     if (urgencyLevel) query.urgencyLevel = urgencyLevel;

//     // Build sort object — urgent campaigns always float to top
//     let sortObj = {};
//     const urgencyOrder = { critical: 0, surgery: 1, normal: 2 };

//     switch (sort) {
//       case "most-funded":
//         sortObj = { raisedAmount: -1 };
//         break;
//       case "ending-soon":
//         sortObj = { deadline: 1 };
//         break;
//       default: // newest
//         sortObj = { createdAt: -1 };
//     }

//     const campaigns = await Campaign.find(query)
//       .populate("creator", "name")
//       .sort(sortObj)
//       .lean();

//     // Put urgent (critical/surgery) first within result set
//     const sorted = campaigns.sort((a, b) => {
//       const diff =
//         (urgencyOrder[a.urgencyLevel] ?? 2) - (urgencyOrder[b.urgencyLevel] ?? 2);
//       if (diff !== 0) return diff;
//       // Secondary sort by original sort key
//       return 0;
//     });

//     return res.status(200).json({ campaigns: sorted });
//   } catch (error) {
//     next(error);
//   }
// };

// // GET /api/campaigns/urgent
// export const getUrgentCampaigns = async (req, res, next) => {
//   try {
//     const campaigns = await Campaign.find({
//       status: "approved",
//       urgencyLevel: { $in: ["critical", "surgery"] },
//     })
//       .populate("creator", "name")
//       .sort({ createdAt: -1 })
//       .lean();

//     return res.status(200).json({ campaigns });
//   } catch (error) {
//     next(error);
//   }
// };

// // GET /api/campaigns/:id
// export const getCampaignById = async (req, res, next) => {
//   try {
//     const campaign = await Campaign.findById(req.params.id)
//       .populate("creator", "name email")
//       .populate({
//         path: "donations",
//         populate: { path: "donor", select: "name" },
//       })
//       .lean();

//     if (!campaign) {
//       return res.status(404).json({ message: "Campaign not found" });
//     }

//     // Hide donor identity for anonymous donations
//     campaign.donations = campaign.donations.map((d) => ({
//       ...d,
//       donor: d.isAnonymous ? null : d.donor,
//     }));

//     return res.status(200).json({ campaign });
//   } catch (error) {
//     next(error);
//   }
// };

// // POST /api/campaigns
// export const createCampaign = async (req, res, next) => {
//   try {
//     const { title, description, category, goalAmount, deadline, urgencyLevel } = req.body;

//     if (!title || !description || !category || !goalAmount || !deadline) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     if (!req.file) {
//       return res.status(400).json({ message: "Cover image is required" });
//     }

//     const coverImage = await uploadToCloudinary(req.file.buffer, "pawrescue/campaigns");

//     const campaign = await Campaign.create({
//       title,
//       description,
//       category,
//       goalAmount: Number(goalAmount),
//       deadline: new Date(deadline),
//       coverImage,
//       urgencyLevel: urgencyLevel || "normal",
//       creator: req.user._id,
//       status: "pending",
//     });

//     return res.status(201).json({ message: "Campaign created and pending approval", campaign });
//   } catch (error) {
//     next(error);
//   }
// };

// // PUT /api/campaigns/:id
// export const updateCampaign = async (req, res, next) => {
//   try {
//     const campaign = await Campaign.findById(req.params.id);
//     if (!campaign) return res.status(404).json({ message: "Campaign not found" });

//     const isOwner = campaign.creator.toString() === req.user._id.toString();
//     const isAdmin = req.user.role === "admin";

//     if (!isOwner && !isAdmin) {
//       return res.status(403).json({ message: "Not authorised to edit this campaign" });
//     }

//     const { title, description, goalAmount, deadline, urgencyLevel } = req.body;

//     if (title) campaign.title = title;
//     if (description) campaign.description = description;
//     if (goalAmount) campaign.goalAmount = Number(goalAmount);
//     if (deadline) campaign.deadline = new Date(deadline);
//     if (urgencyLevel) campaign.urgencyLevel = urgencyLevel;

//     if (req.file) {
//       campaign.coverImage = await uploadToCloudinary(req.file.buffer, "pawrescue/campaigns");
//     }

//     await campaign.save();
//     return res.status(200).json({ message: "Campaign updated", campaign });
//   } catch (error) {
//     next(error);
//   }
// };

// // POST /api/campaigns/:id/updates
// export const addCampaignUpdate = async (req, res, next) => {
//   try {
//     const campaign = await Campaign.findById(req.params.id).populate("donations");
//     if (!campaign) return res.status(404).json({ message: "Campaign not found" });

//     const isOwner = campaign.creator.toString() === req.user._id.toString();
//     const isAdmin = req.user.role === "admin";

//     if (!isOwner && !isAdmin) {
//       return res.status(403).json({ message: "Not authorised to post updates" });
//     }

//     const { stage, text } = req.body;
//     if (!stage || !text) {
//       return res.status(400).json({ message: "Stage and text are required" });
//     }
//     if (!["before", "during", "after"].includes(stage)) {
//       return res.status(400).json({ message: "Stage must be before, during, or after" });
//     }

//     let image = null;
//     if (req.file) {
//       image = await uploadToCloudinary(req.file.buffer, "pawrescue/updates");
//     }

//     campaign.updates.push({ stage, text, image, date: new Date() });
//     await campaign.save();

//     // Notify all donors of this campaign
//     const donorDonations = await Donation.find({
//       campaign: campaign._id,
//       status: "success",
//     }).distinct("donor");

//     const stageLabel = stage.charAt(0).toUpperCase() + stage.slice(1);
//     await Promise.all(
//       donorDonations.map((donorId) =>
//         createNotification({
//           user: donorId,
//           title: `Update on "${campaign.title}"`,
//           message: `A ${stageLabel} update has been posted: ${text.substring(0, 100)}${text.length > 100 ? "…" : ""}`,
//           type: "campaign_update",
//           campaign: campaign._id,
//         })
//       )
//     );

//     return res.status(201).json({ message: "Update posted", campaign });
//   } catch (error) {
//     next(error);
//   }
// };


import Campaign from "../models/Campaign.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import createNotification from "../utils/createNotification.js";
import Donation from "../models/Donation.js";

// GET /api/campaigns
export const getCampaigns = async (req, res, next) => {
  try {
    const { category, urgencyLevel, sort } = req.query;

    const query = { status: "approved" };
    if (category) query.category = category;
    if (urgencyLevel) query.urgencyLevel = urgencyLevel;

    let sortObj = {};
    const urgencyOrder = { critical: 0, surgery: 1, normal: 2 };

    switch (sort) {
      case "most-funded":
        sortObj = { raisedAmount: -1 };
        break;
      case "ending-soon":
        sortObj = { deadline: 1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const campaigns = await Campaign.find(query)
      .populate("creator", "name")
      .sort(sortObj)
      .lean();

    // Put urgent (critical/surgery) first
    const sorted = campaigns.sort((a, b) => {
      const diff =
        (urgencyOrder[a.urgencyLevel] ?? 2) - (urgencyOrder[b.urgencyLevel] ?? 2);
      return diff !== 0 ? diff : 0;
    });

    return res.status(200).json({ campaigns: sorted });
  } catch (error) {
    next(error);
  }
};

// GET /api/campaigns/urgent
export const getUrgentCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({
      status: "approved",
      urgencyLevel: { $in: ["critical", "surgery"] },
    })
      .populate("creator", "name")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ campaigns });
  } catch (error) {
    next(error);
  }
};

// GET /api/campaigns/:id
export const getCampaignById = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("creator", "name email location organization")
      .populate({
        path: "donations",
        populate: { path: "donor", select: "name" },
      })
      .lean();

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Hide donor identity for anonymous donations
    campaign.donations = campaign.donations.map((d) => ({
      ...d,
      donor: d.isAnonymous ? null : d.donor,
    }));

    // Share metadata
    const shareUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/campaigns/${campaign._id}`;
    const shareText = `Support this PawRescue campaign: ${campaign.title}`;

    return res.status(200).json({ campaign: { ...campaign, shareUrl, shareText } });
  } catch (error) {
    next(error);
  }
};

// POST /api/campaigns
export const createCampaign = async (req, res, next) => {
  try {
    const { title, description, category, goalAmount, deadline, urgencyLevel } = req.body;

    if (!title || !description || !category || !goalAmount || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const coverImage = await uploadToCloudinary(req.file.buffer, "pawrescue/campaigns");

    const campaign = await Campaign.create({
      title,
      description,
      category,
      goalAmount: Number(goalAmount),
      deadline: new Date(deadline),
      coverImage,
      urgencyLevel: urgencyLevel || "normal",
      creator: req.user._id,
      status: "pending",
    });

    return res.status(201).json({ message: "Campaign created and pending approval", campaign });
  } catch (error) {
    next(error);
  }
};

// PUT /api/campaigns/:id
export const updateCampaign = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const isOwner = campaign.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorised to edit this campaign" });
    }

    const { title, description, goalAmount, deadline, urgencyLevel } = req.body;

    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (goalAmount) campaign.goalAmount = Number(goalAmount);
    if (deadline) campaign.deadline = new Date(deadline);
    if (urgencyLevel) campaign.urgencyLevel = urgencyLevel;

    if (req.file) {
      campaign.coverImage = await uploadToCloudinary(req.file.buffer, "pawrescue/campaigns");
    }

    await campaign.save();
    return res.status(200).json({ message: "Campaign updated", campaign });
  } catch (error) {
    next(error);
  }
};

// POST /api/campaigns/:id/updates
export const addCampaignUpdate = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const isOwner = campaign.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorised to post updates" });
    }

    const { stage, text } = req.body;
    if (!stage || !text) {
      return res.status(400).json({ message: "Stage and text are required" });
    }
    if (!["before", "during", "after"].includes(stage)) {
      return res.status(400).json({ message: "Stage must be before, during, or after" });
    }

    let image = null;
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer, "pawrescue/updates");
    }

    campaign.updates.push({ stage, text, image, date: new Date() });
    await campaign.save();

    // Notify all donors of this campaign
    const donorIds = await Donation.find({
      campaign: campaign._id,
      status: "success",
    }).distinct("donor");

    const stageLabel = stage.charAt(0).toUpperCase() + stage.slice(1);
    await Promise.all(
      donorIds.map((donorId) =>
        createNotification({
          user: donorId,
          title: `Update on "${campaign.title}"`,
          message: `A ${stageLabel} update has been posted: ${text.substring(0, 100)}${text.length > 100 ? "…" : ""}`,
          type: "campaign_update",
          campaign: campaign._id,
        })
      )
    );

    return res.status(201).json({ message: "Update posted", campaign });
  } catch (error) {
    next(error);
  }
};

// POST /api/campaigns/:id/medical-documents
export const uploadMedicalDocument = async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const isOwner = campaign.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    // Campaigners can only upload to their own campaign
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorised to upload documents for this campaign" });
    }

    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Document title is required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Document file is required" });
    }

    const fileUrl = await uploadToCloudinary(req.file.buffer, "pawrescue/medical-documents");

    // Detect file type from mimetype
    let fileType = "other";
    if (req.file.mimetype.startsWith("image/")) {
      fileType = "image";
    } else if (req.file.mimetype === "application/pdf") {
      fileType = "pdf";
    }

    const medicalDocument = {
      title: title.trim(),
      fileUrl,
      fileType,
      uploadedBy: req.user._id,
      uploadedAt: new Date(),
    };

    campaign.medicalDocuments.push(medicalDocument);
    await campaign.save();

    const saved = campaign.medicalDocuments[campaign.medicalDocuments.length - 1];

    return res.status(201).json({
      message: "Medical document uploaded successfully",
      medicalDocument: saved,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/campaigns/:campaignId/medical-documents/:documentId
export const deleteMedicalDocument = async (req, res, next) => {
  try {
    const { campaignId, documentId } = req.params;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    const isOwner = campaign.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorised to delete documents for this campaign" });
    }

    const docIndex = campaign.medicalDocuments.findIndex(
      (d) => d._id.toString() === documentId
    );
    if (docIndex === -1) {
      return res.status(404).json({ message: "Medical document not found" });
    }

    campaign.medicalDocuments.splice(docIndex, 1);
    await campaign.save();

    return res.status(200).json({ message: "Medical document deleted successfully" });
  } catch (error) {
    next(error);
  }
};