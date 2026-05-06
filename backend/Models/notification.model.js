const mongoose = require("mongoose");

/**
 * Notification model — owned by Member 5 (src/models/Notification.js).
 * Stub placed here so Member 2's createNotification utility resolves its import
 * without depending on Member 5's branch being merged first.
 *
 * Types used across the team:
 *   "urgent"          — Member 4: admin marks campaign critical/surgery
 *   "campaign_update" — Member 2: timeline update posted
 *   "donation"        — Member 3: donation confirmed
 *   "admin"           — Member 4: campaigner/campaign approved or rejected
 */
const notificationSchema = new mongoose.Schema(
  {
    // Member 1 User._id — the recipient
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["urgent", "campaign_update", "donation", "admin"],
      required: true,
    },
    isRead: { type: Boolean, default: false },
    // Optional — links back to the relevant campaign
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      default: null,
    },
  },
  { timestamps: true }
);

// Member 5: GET /api/notifications — sort newest first, filter by user
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);