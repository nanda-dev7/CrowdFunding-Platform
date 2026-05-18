import express from "express";
import {
  getCampaignerRequests,
  approveCampaigner,
  rejectCampaigner,
  getPendingCampaigns,
  approveCampaign,
  rejectCampaign,
  markCampaignUrgent,
  getAdminStats,
  getAllUsers,
  changeUserRole,
} from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// Campaigner requests
router.get("/campaigner-requests", getCampaignerRequests);
router.put("/campaigner/:id/approve", approveCampaigner);
router.put("/campaigner/:id/reject", rejectCampaigner);

// Campaign management
router.get("/campaigns/pending", getPendingCampaigns);
router.put("/campaigns/:id/approve", approveCampaign);
router.put("/campaigns/:id/reject", rejectCampaign);
router.put("/campaigns/:id/urgent", markCampaignUrgent);

// Stats
router.get("/stats", getAdminStats);

// Users
router.get("/users", getAllUsers);
router.put("/users/:id/role", changeUserRole);

export default router;