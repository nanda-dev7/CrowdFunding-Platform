import CampaignerRequest from "../models/campaignerRequest.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// POST /api/campaigner/apply
export const applyAsCampaigner = async (req, res, next) => {
  try {
    const {
      campaignerType,
      publicDisplayName,
      campaignerReason,
      location,
      animalWelfareRole,
      organizationType,
      authorizedPersonRole,
      organizationEmailPhone,
      referenceContact,
      payoutMethod,
      upiId,
      bankDetails,
    } = req.body;

    if (!campaignerType || !publicDisplayName || !campaignerReason || !location || !referenceContact || !payoutMethod) {
      return res.status(400).json({ message: "Required fields are missing." });
    }
    if (req.user.role !== "donor") {
      return res.status(400).json({ message: "Only donors can apply as campaigners" });
    }

    const files = req.files || {};
    if (!files.animalWelfareProof || !files.payoutProof) {
      return res.status(400).json({ message: "Animal welfare proof and payout proof are required." });
    }
    if (campaignerType === "Individual" && !files.identityProof) {
      return res.status(400).json({ message: "Identity proof is required for individuals." });
    }
    if (campaignerType !== "Individual" && !files.organizationProof) {
      return res.status(400).json({ message: "Organization proof is required for groups/NGOs." });
    }

    // Prevent duplicate pending request
    const existing = await CampaignerRequest.findOne({
      userId: req.user._id,
      status: "pending",
    });
    if (existing) {
      return res.status(409).json({ message: "You already have a pending application" });
    }

    // Upload files concurrently
    const uploadTasks = [];
    const fileKeys = ["identityProof", "animalWelfareProof", "payoutProof", "organizationProof", "authorizationLetter"];
    
    fileKeys.forEach((key) => {
      if (files[key] && files[key][0]) {
        uploadTasks.push(
          uploadToCloudinary(files[key][0].buffer, "pawrescue/documents").then((url) => ({ key: `${key}Url`, url }))
        );
      }
    });

    const uploadedUrls = await Promise.all(uploadTasks);
    const urlsMap = uploadedUrls.reduce((acc, curr) => {
      acc[curr.key] = curr.url;
      return acc;
    }, {});

    const request = await CampaignerRequest.create({
      userId: req.user._id,
      campaignerType,
      publicDisplayName,
      campaignerReason,
      location,
      animalWelfareRole,
      organizationType,
      authorizedPersonRole,
      organizationEmailPhone,
      referenceContact,
      payoutMethod,
      upiId,
      bankDetails: bankDetails ? JSON.parse(bankDetails) : undefined,
      ...urlsMap,
      status: "pending",
    });

    return res.status(201).json({
      message: "Application submitted. Please wait for admin review.",
      request,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/campaigner/status
export const getCampaignerStatus = async (req, res, next) => {
  try {
    const request = await CampaignerRequest.findOne({ userId: req.user._id })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    if (!request) {
      return res.status(200).json({ status: "not_applied", request: null });
    }

    return res.status(200).json({ status: request.status, request });
  } catch (error) {
    next(error);
  }
};