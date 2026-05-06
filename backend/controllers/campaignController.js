import Campaign from "../models/CampaignModel.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import createNotification from "../controllers/notification.controller.js";

const SORT_MAP = {
  "most-funded": { raisedAmount: -1 },
  "ending-soon": { deadline: 1 },
  newest: { createdAt: -1 },
};

const URGENCY_ORDER = { critical: 0, surgery: 1, normal: 2 };

export const getCampaigns = async (req, res) => {
  try {
    const { category, urgencyLevel, sort } = req.query;

    const query = { status: "approved" };
    if (category) query.category = category;
    if (urgencyLevel) query.urgencyLevel = urgencyLevel;

    const sortObj = SORT_MAP[sort] || SORT_MAP.newest;
    const campaigns = await Campaign.find(query)
      .populate("creator", "name")
      .sort(sortObj)
      .lean();

    campaigns.sort(
      (a, b) =>
        (URGENCY_ORDER[a.urgencyLevel] ?? 2) - (URGENCY_ORDER[b.urgencyLevel] ?? 2)
    );

    res.json({ success: true, count: campaigns.length, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUrgentCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      status: "approved",
      urgencyLevel: { $in: ["critical", "surgery"] },
    })
      .populate("creator", "name")
      .sort({ deadline: 1 })
      .lean();

    res.json({ success: true, count: campaigns.length, data: campaigns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/campaigns/:id ───────────────────────────────────────────────────
/**
 * Full campaign detail.
 * Populates creator name + donations.
 * Hides donor identity when isAnonymous === true (Member 3 Donation field name).
 */
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate("creator", "name email")
      .populate({
        path: "donations",
        // Member 3 Donation model fields: isAnonymous (not anonymous)
        select: "amount donor isAnonymous message createdAt status",
        populate: { path: "donor", select: "name" },
      })
      .lean();

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    campaign.donations = campaign.donations
      .filter((d) => d.status === "success") // only confirmed donations
      .map((d) => {
        if (d.isAnonymous) {
          return {
            _id: d._id,
            amount: d.amount,
            donorName: "Anonymous",
            donor: null,
            message: d.message,
            createdAt: d.createdAt,
          };
        }
        return {
          _id: d._id,
          amount: d.amount,
          donorName: d.donor?.name ?? "Unknown",
          donor: d.donor,
          message: d.message,
          createdAt: d.createdAt,
        };
      });

    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCampaign = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Cover image is required" });
    }

    const { title, description, category, goalAmount, deadline, urgencyLevel } =
      req.body;

    // Validate required text fields
    if (!title || !description || !category || !goalAmount || !deadline) {
      return res
        .status(400)
        .json({ success: false, message: "title, description, category, goalAmount and deadline are required" });
    }

    // Upload cover image to Cloudinary (Member 2 spec step 4)
    const coverImage = await uploadToCloudinary(req.file.buffer, "campaigns");

    // Member 2 spec step 5-6: status defaults to pending; creator = logged-in user
    const campaign = await Campaign.create({
      title,
      description,
      category,
      goalAmount,
      deadline,
      coverImage,
      urgencyLevel: urgencyLevel || "normal",
      creator: req.user._id,
    });

    res.status(201).json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/campaigns/:id ───────────────────────────────────────────────────
/**
 * Edit an existing campaign.
 * Only the campaign creator or an admin may edit.
 * Optionally replaces the cover image.
 */
export const editCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });
    }

    const isOwner =
      campaign.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised to edit this campaign" });
    }

    const { title, description, category, goalAmount, deadline, urgencyLevel } =
      req.body;

    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (category) campaign.category = category;
    if (goalAmount) campaign.goalAmount = goalAmount;
    if (deadline) campaign.deadline = deadline;
    if (urgencyLevel) campaign.urgencyLevel = urgencyLevel;

    if (req.file) {
      campaign.coverImage = await uploadToCloudinary(
        req.file.buffer,
        "campaigns"
      );
    }

    await campaign.save();
    res.json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/campaigns/:id/updates ─────────────────────────────────────────
/**
 * Push a timeline update (before / during / after) to the campaign.
 * Only the campaign creator or admin may post updates.
 * Notifies all donors via Member 5's createNotification utility.
 */
export const addTimelineUpdate = async (req, res) => {
  try {
    // Populate donations → donor so we can read each donor's _id for notifications
    const campaign = await Campaign.findById(req.params.id).populate({
      path: "donations",
      select: "donor status",
      populate: { path: "donor", select: "_id" },
    });

    if (!campaign) {
      return res
        .status(404)
        .json({ success: false, message: "Campaign not found" });
    }

    // Auth: creator or admin only
    const isOwner =
      campaign.creator.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorised to post updates" });
    }

    const { stage, text } = req.body;
    if (!stage || !text) {
      return res
        .status(400)
        .json({ success: false, message: "stage and text are required" });
    }

    // Optional timeline image
    let image = null;
    if (req.file) {
      image = await uploadToCloudinary(req.file.buffer, "campaign-updates");
    }

    // Member 2 spec: push update into campaign updates array
    campaign.updates.push({ stage, text, image, date: new Date() });
    await campaign.save();

    const savedUpdate = campaign.updates[campaign.updates.length - 1];

    // Member 5 spec: notify all donors who have a successful donation
    // Deduplicate donor IDs to send one notification per donor
    const donorIds = [
      ...new Set(
        campaign.donations
          .filter((d) => d.status === "success" && d.donor?._id)
          .map((d) => d.donor._id.toString())
      ),
    ];

    // Fire notifications in parallel; don't block the response
    await Promise.allSettled(
      donorIds.map((donorId) =>
        createNotification({
          user: donorId,
          title: `Update on "${campaign.title}"`,
          // Member 5 notification type: campaign_update
          type: "campaign_update",
          message: `Stage: ${stage} — ${text.slice(0, 100)}${text.length > 100 ? "…" : ""}`,
          campaign: campaign._id,
        })
      )
    );

    res.status(201).json({ success: true, data: savedUpdate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};