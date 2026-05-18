import express from "express";
import {
  getNotifications,
  markNotificationRead,
} from "../controllers/notification.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getNotifications);
router.put("/:id/read", markNotificationRead);

export default router;