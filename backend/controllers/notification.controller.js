import Notification from "../models/Notification.js";

const NOTIFICATION_LIMIT = 20;

// GET /api/notifications
export const getNotifications = async (req, res, next) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .limit(NOTIFICATION_LIMIT)
        .populate("campaign", "title coverImage")
        .lean(),
      Notification.countDocuments({ user: req.user._id, isRead: false }),
    ]);

    return res.status(200).json({ unreadCount, notifications });
  } catch (error) {
    next(error);
  }
};

// PUT /api/notifications/:id/read
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({ message: "Marked as read", notification });
  } catch (error) {
    next(error);
  }
};