import express from "express";
import {
  getCampaigns,
  getUrgentCampaigns,
  getCampaignById,
  createCampaign,
  editCampaign,
  addTimelineUpdate,
} from "../controllers/campaignController.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// ─── Public routes ────────────────────────────────────────────────────────────

// GET /api/campaigns
// ?category=Emergency|Medical|Shelter|Feeding
// ?urgencyLevel=normal|critical|surgery
// ?sort=newest|most-funded|ending-soon
router.get("/", getCampaigns);

// GET /api/campaigns/urgent
// ⚠️  MUST be above /:id — otherwise Express matches "urgent" as a Mongo ObjectId
//     and getCampaignById throws a CastError.
router.get("/urgent", getUrgentCampaigns);

// GET /api/campaigns/:id
router.get("/:id", getCampaignById);

// ─── Protected routes ─────────────────────────────────────────────────────────

// POST /api/campaigns  — create (campaigner or admin)
// upload.single("coverImage") pipes the file buffer into req.file
router.post(
  "/",
  protect,
  requireRole("campaigner", "admin"),
  upload.single("coverImage"),
  createCampaign
);

// PUT /api/campaigns/:id  — edit (creator or admin, checked inside controller)
router.put(
  "/:id",
  protect,
  requireRole("campaigner", "admin"),
  upload.single("coverImage"),
  editCampaign
);

// POST /api/campaigns/:id/updates  — timeline update (creator or admin)
// Optional image field name: "image"
router.post(
  "/:id/updates",
  protect,
  requireRole("campaigner", "admin"),
  upload.single("image"),
  addTimelineUpdate
);

export default router;