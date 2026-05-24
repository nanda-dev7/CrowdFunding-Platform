// import Donation from "../models/donation.js";
// import Coupon from "../models/coupon.js";
// import Campaign from "../models/campaign.js";

// const RECENT_LIMIT = 5;

// // GET /api/users/me/dashboard
// export const getDonorDashboard = async (req, res, next) => {
//   try {
//     const userId = req.user._id;

//     // All successful donations by this user
//     const donations = await Donation.find({ donor: userId, status: "success" })
//       .sort({ createdAt: -1 })
//       .populate("campaign", "title coverImage category urgencyLevel")
//       .lean();

//     const totalDonations = donations.length;
//     const amountDonated = donations.reduce((sum, d) => sum + d.amount, 0);

//     // Unique campaign IDs
//     const uniqueCampaignIds = [
//       ...new Set(donations.map((d) => d.campaign?._id?.toString()).filter(Boolean)),
//     ];
//     const campaignsSupported = uniqueCampaignIds.length;

//     // Dogs helped = unique campaigns supported
//     const dogsHelped = campaignsSupported;

//     // Emergency rescues (critical or surgery urgency)
//     const emergencyCampaigns = await Campaign.find({
//       _id: { $in: uniqueCampaignIds },
//       urgencyLevel: "urgent",
//     }).select("_id");
//     const emergencyRescuesSupported = emergencyCampaigns.length;

//     const recentDonations = donations.slice(0, RECENT_LIMIT);

//     const coupons = await Coupon.find({ user: userId }).sort({ createdAt: -1 }).lean();

//     return res.status(200).json({
//       totalDonations,
//       amountDonated,
//       campaignsSupported,
//       dogsHelped,
//       emergencyRescuesSupported,
//       recentDonations,
//       coupons,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // GET /api/campaigner/dashboard
// export const getCampaignerDashboard = async (req, res, next) => {
//   try {
//     const userId = req.user._id;

//     const campaigns = await Campaign.find({ creator: userId })
//       .sort({ createdAt: -1 })
//       .lean();

//     const campaignsCreated = campaigns.length;
//     const fundsRaised = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);

//     const campaignsByStatus = campaigns.reduce(
//       (acc, c) => {
//         const s = c.status || "pending";
//         acc[s] = (acc[s] || 0) + 1;
//         return acc;
//       },
//       { pending: 0, approved: 0, rejected: 0, completed: 0 }
//     );

//     const campaignIds = campaigns.map((c) => c._id);
//     const donorAgg = await Donation.aggregate([
//       { $match: { campaign: { $in: campaignIds }, status: "success" } },
//       { $group: { _id: "$donor" } },
//       { $count: "uniqueDonors" },
//     ]);
//     const totalDonors = donorAgg[0]?.uniqueDonors || 0;

//     return res.status(200).json({
//       campaignsCreated,
//       fundsRaised,
//       totalDonors,
//       campaignsByStatus,
//       campaigns,
//     });
//   } catch (error) {
//     next(error);
//   }
// };




import Donation from "../models/donation.js";
import Campaign from "../models/campaign.js";

const RECENT_LIMIT = 5;

// GET /api/users/me/dashboard
export const getDonorDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // All successful donations by this user
    const donations = await Donation.find({ donor: userId, status: "success" })
      .sort({ createdAt: -1 })
      .populate("campaign", "title coverImage category urgencyLevel")
      .lean();

    const totalDonations = donations.length;
    const amountDonated = donations.reduce((sum, d) => sum + d.amount, 0);

    // Unique campaign IDs
    const uniqueCampaignIds = [
      ...new Set(donations.map((d) => d.campaign?._id?.toString()).filter(Boolean)),
    ];
    const campaignsSupported = uniqueCampaignIds.length;

    // Dogs helped = unique campaigns supported
    const dogsHelped = campaignsSupported;

    // Emergency rescues (critical or surgery urgency)
    const emergencyCampaigns = await Campaign.find({
      _id: { $in: uniqueCampaignIds },
      urgencyLevel: "urgent",
    }).select("_id");
    const emergencyRescuesSupported = emergencyCampaigns.length;

    const recentDonations = donations.slice(0, RECENT_LIMIT);

    return res.status(200).json({
      totalDonations,
      amountDonated,
      campaignsSupported,
      dogsHelped,
      emergencyRescuesSupported,
      recentDonations,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/campaigner/dashboard
export const getCampaignerDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const campaigns = await Campaign.find({ creator: userId })
      .sort({ createdAt: -1 })
      .lean();

    const campaignsCreated = campaigns.length;
    const fundsRaised = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);

    const campaignsByStatus = campaigns.reduce(
      (acc, c) => {
        const s = c.status || "pending";
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0, completed: 0 }
    );

    const campaignIds = campaigns.map((c) => c._id);
    const donorAgg = await Donation.aggregate([
      { $match: { campaign: { $in: campaignIds }, status: "success" } },
      { $group: { _id: "$donor" } },
      { $count: "uniqueDonors" },
    ]);
    const totalDonors = donorAgg[0]?.uniqueDonors || 0;

    const recentDonations = await Donation.find({ campaign: { $in: campaignIds }, status: "success" })
      .sort({ createdAt: -1 })
      .populate("donor", "name email")
      .populate("campaign", "title")
      .lean();

    return res.status(200).json({
      campaignsCreated,
      fundsRaised,
      totalDonors,
      campaignsByStatus,
      campaigns,
      recentDonations,
    });
  } catch (error) {
    next(error);
  }
};