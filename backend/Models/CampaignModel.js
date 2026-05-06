const mongoose = require("mongoose");

// ─── Sub-schema: timeline update ────────────────────────────────────────────
// Used by Member 2's addTimelineUpdate and Member 5's campaign_update notification
const updateSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      enum: ["before", "during", "after"],
      required: true,
    },
    text: { type: String, required: true },
    image: { type: String, default: null },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

// ─── Main schema ─────────────────────────────────────────────────────────────
const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    // Member 5 donor dashboard: counts Emergency category for emergencyRescuesSupported
    category: {
      type: String,
      enum: ["Emergency", "Medical", "Shelter", "Feeding"],
      required: [true, "Category is required"],
    },
    goalAmount: {
      type: Number,
      required: [true, "Goal amount is required"],
      min: [1, "Goal amount must be positive"],
    },
    // Incremented by Member 3 on donation confirm
    raisedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },
    // Member 4 admin controls: approve / reject / complete
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    // Member 4 admin: mark urgent; Member 2: filter + sort by urgency
    urgencyLevel: {
      type: String,
      enum: ["normal", "critical", "surgery"],
      default: "normal",
    },
    // Member 1 User._id — populated in getCampaignById
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Member 2: timeline updates array (before / during / after)
    updates: [updateSchema],
    // Member 3: pushed on donation confirm; Member 5 dashboard: donor count
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
campaignSchema.index({ status: 1, urgencyLevel: 1 });   // listing + urgent filter
campaignSchema.index({ status: 1, createdAt: -1 });      // newest sort
campaignSchema.index({ status: 1, deadline: 1 });        // ending-soon sort
campaignSchema.index({ status: 1, raisedAmount: -1 });   // most-funded sort
campaignSchema.index({ status: 1, creator: 1 });         // campaigner dashboard (M5)

module.exports = mongoose.model("Campaign", campaignSchema);