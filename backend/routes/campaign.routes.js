// import express from "express";
// import {
//   getCampaigns,
//   getUrgentCampaigns,
//   getCampaignById,
//   createCampaign,
//   updateCampaign,
//   addCampaignUpdate,
// } from "../controllers/campaign.controller.js";
// import authMiddleware from "../middleware/auth.middleware.js";
// import roleMiddleware from "../middleware/role.middleware.js";
// import upload from "../middleware/upload.middleware.js";

// const router = express.Router();

// // Route to get campaigns
// router.get("/", getCampaigns);
// // IMPORTANT: /urgent must be defined BEFORE /:id
// router.get("/urgent", getUrgentCampaigns);
// router.get("/:id", getCampaignById);

// // Protected routes
// router.post(
//   "/",
//   authMiddleware,
//   roleMiddleware("campaigner", "admin"),
//   upload.single("coverImage"),
//   createCampaign
// );

// router.put(
//   "/:id",
//   authMiddleware,
//   roleMiddleware("campaigner", "admin"),
//   upload.single("coverImage"),
//   updateCampaign
// );

// router.post(
//   "/:id/updates",
//   authMiddleware,
//   roleMiddleware("campaigner", "admin"),
//   upload.single("image"),
//   addCampaignUpdate
// );

// export default router;




import express from "express";
import {
  getCampaigns,
  getUrgentCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  addCampaignUpdate,
  uploadSupportingDocument,
  deleteSupportingDocument,
  updateExpenses,
} from "../controllers/campaign.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.get("/", getCampaigns);
// IMPORTANT: /urgent must be before /:id
router.get("/urgent", getUrgentCampaigns);
router.get("/:id", getCampaignById);

// ── Protected routes ──────────────────────────────────────────────────────────
router.post(
  "/",
  authMiddleware,
  roleMiddleware("campaigner", "admin"),
  upload.single("coverImage"),
  createCampaign
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("campaigner", "admin"),
  upload.single("coverImage"),
  updateCampaign
);

router.post(
  "/:id/updates",
  authMiddleware,
  roleMiddleware("campaigner", "admin"),
  upload.single("image"),
  addCampaignUpdate
);

// Supporting documents
router.post(
  "/:id/supporting-documents",
  authMiddleware,
  roleMiddleware("campaigner", "admin"),
  upload.single("document"),
  uploadSupportingDocument
);

router.delete(
  "/:campaignId/supporting-documents/:documentId",
  authMiddleware,
  roleMiddleware("campaigner", "admin"),
  deleteSupportingDocument
);

// Transparency expenses
router.put(
  "/:id/expenses",
  authMiddleware,
  roleMiddleware("campaigner", "admin"),
  updateExpenses
);

export default router;