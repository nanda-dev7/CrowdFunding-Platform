const Campaign = require("../models/Campaign");

const sendResponse = (res, statusCode, success, message, data = {}) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
  });
};

const isAdmin = (user) => user && user.role === "Admin";

const getUserId = (user) => user && (user.id || user._id);

const isCampaignCreator = (campaign, user) => {
  const userId = getUserId(user);
  return userId && campaign.creatorId.toString() === userId.toString();
};

const populateCreator = {
  path: "creatorId",
  select: "name email",
};

const createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create({
      ...req.body,
      creatorId: req.user.id,
      status: "pending",
    });

    const populatedCampaign = await campaign.populate(populateCreator);

    return sendResponse(
      res,
      201,
      true,
      "Campaign created successfully and sent for admin approval",
      populatedCampaign
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getAllCampaigns = async (req, res) => {
  try {
    const query = isAdmin(req.user) ? {} : { status: "approved" };

    const campaigns = await Campaign.find(query)
      .populate(populateCreator)
      .sort({ createdAt: -1 });

    return sendResponse(
      res,
      200,
      true,
      "Campaigns fetched successfully",
      campaigns
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const getCampaignById = async (req, res) => {
  try {
    const query = isAdmin(req.user)
      ? { _id: req.params.id }
      : { _id: req.params.id, status: "approved" };

    const campaign = await Campaign.findOne(query).populate(populateCreator);

    if (!campaign) {
      return sendResponse(res, 404, false, "Campaign not found");
    }

    return sendResponse(
      res,
      200,
      true,
      "Campaign fetched successfully",
      campaign
    );
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return sendResponse(res, 404, false, "Campaign not found");
    }

    if (!isCampaignCreator(campaign, req.user)) {
      return sendResponse(
        res,
        403,
        false,
        "Only the campaign creator can update this campaign"
      );
    }

    const { status, creatorId, raisedAmount, isVerified, ...updates } =
      req.body;

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate(populateCreator);

    return sendResponse(
      res,
      200,
      true,
      "Campaign updated successfully",
      updatedCampaign
    );
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return sendResponse(res, 404, false, "Campaign not found");
    }

    if (!isCampaignCreator(campaign, req.user) && !isAdmin(req.user)) {
      return sendResponse(
        res,
        403,
        false,
        "Only the campaign creator or admin can delete this campaign"
      );
    }

    await Campaign.findByIdAndDelete(req.params.id);
    return sendResponse(res, 200, true, "Campaign deleted successfully");
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
};