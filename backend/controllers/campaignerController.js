import CampaignerRequest from "../Models/CampaignerRequest.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

export const applyCampaigner = async (req, res) => {
  try {
    const { fullName, contact, organization, description, documentUrl } = req.body || {};

    if (!fullName || !contact || !organization || !description) {
      return res.status(400).json({
        success: false,
        message: "fullName, contact, organization and description are required",
      });
    }

    const isUploadProvided = !!req.file;
    const isDocumentUrlProvided = !!documentUrl;

    if (!isUploadProvided && !isDocumentUrlProvided) {
      return res.status(400).json({
        success: false,
        message: "Document upload or documentUrl is required",
      });
    }

    if (req.user.role !== "donor") {
      return res.status(403).json({
        success: false,
        message: "Only donors may submit a campaigner application",
      });
    }

    const existingPending = await CampaignerRequest.findOne({
      userId: req.user._id,
      status: "pending",
    });

    if (existingPending) {
      return res.status(409).json({
        success: false,
        message: "A pending campaigner request already exists",
      });
    }

    const finalDocumentUrl = isUploadProvided
      ? await uploadToCloudinary(req.file.buffer, "campaigner-docs")
      : documentUrl;

    const campaignerRequest = await CampaignerRequest.create({
      userId: req.user._id,
      fullName,
      contact,
      organization,
      description,
      documentUrl: finalDocumentUrl,
    });

    res.status(201).json({ success: true, data: campaignerRequest });
  } catch (error) {
    console.error("Campaigner application error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampaignerStatus = async (req, res) => {
  try {
    const campaignerRequest = await CampaignerRequest.findOne({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    if (!campaignerRequest) {
      return res.status(404).json({
        success: false,
        message: "No campaigner request found",
      });
    }

    res.json({ success: true, data: campaignerRequest });
  } catch (error) {
    console.error("Campaigner status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
