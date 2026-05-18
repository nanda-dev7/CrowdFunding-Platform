import express from "express";
import {
  applyAsCampaigner,
  getCampaignerStatus,
} from "../controllers/campaigner.controller.js";
import { getCampaignerDashboard } from "../controllers/dashboard.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// All routes require auth
router.use(authMiddleware);

router.post("/apply", upload.single("document"), applyAsCampaigner);
router.get("/status", getCampaignerStatus);
router.get(
  "/dashboard",
  roleMiddleware("campaigner", "admin"),
  getCampaignerDashboard
);

export default router;