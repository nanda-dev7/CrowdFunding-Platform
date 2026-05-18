import Notification from "../models/Notification.js";

/**
 * Creates a notification for a user.
 * @param {Object} params
 * @param {string} params.user       - User ObjectId
 * @param {string} params.title      - Short title
 * @param {string} params.message    - Full message body
 * @param {string} params.type       - urgent | campaign_update | donation | admin
 * @param {string} [params.campaign] - Optional campaign ObjectId
 */
const createNotification = async ({ user, title, message, type, campaign = null }) => {
  try {
    return await Notification.create({ user, title, message, type, campaign });
  } catch (err) {
    // Notifications are non-critical; log but don't throw
    console.error("Failed to create notification:", err.message);
    return null;
  }
};

export default createNotification;