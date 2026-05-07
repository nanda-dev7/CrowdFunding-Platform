import express from "express";
import { protect, requireRole } from "../middleware/auth.middleware.js";
import {
  getCampaignerRequests,
  approveCampaignerRequest,
  rejectCampaignerRequest,
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
  updateCampaignUrgency,
  getAdminStats,
  getUsers,
  updateUserRole,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, requireRole("admin"));

router.get("/campaigner-requests", getCampaignerRequests);
router.put("/campaigner/:id/approve", approveCampaignerRequest);
router.put("/campaigner/:id/reject", rejectCampaignerRequest);

router.get("/campaigns/pending", getPendingCampaigns);
router.put("/campaigns/:id/approve", approveCampaign);
router.put("/campaigns/:id/reject", rejectCampaign);
router.put("/campaigns/:id/urgent", updateCampaignUrgency);

router.get("/stats", getAdminStats);
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);

export default router;
