const Notification = require("../models/Notification");

/**
 * createNotification
 * Owned by Member 5 (src/utils/createNotification.js).
 *
 * Called by:
 *   - Member 2: campaign timeline update  → type "campaign_update"
 *   - Member 3: donation confirmed        → type "donation"
 *   - Member 4: campaigner approved       → type "admin"
 *   - Member 4: campaign approved/urgent  → type "admin" / "urgent"
 *
 * @param {{ user, title, message, type, campaign }} params
 * @returns {Promise<Document>}
 */
const createNotification = async ({ user, title, message, type, campaign }) => {
  return Notification.create({
    user,
    title,
    message,
    type,
    campaign: campaign || null,
  });
};

module.exports = createNotification;