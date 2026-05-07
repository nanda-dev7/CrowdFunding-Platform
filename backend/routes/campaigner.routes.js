import express from "express";
import { protect, requireRole } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  applyCampaigner,
  getCampaignerStatus,
} from "../controllers/campaignerController.js";

const router = express.Router();

router.post(
  "/apply",
  protect,
  requireRole("donor"),
  upload.single("document"),
  applyCampaigner
);

router.get("/status", protect, getCampaignerStatus);

export default router;
