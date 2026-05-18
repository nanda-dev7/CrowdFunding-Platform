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
  uploadMedicalDocument,
  deleteMedicalDocument,
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

// Medical documents
router.post(
  "/:id/medical-documents",
  authMiddleware,
  roleMiddleware("campaigner", "admin"),
  upload.single("document"),
  uploadMedicalDocument
);

router.delete(
  "/:campaignId/medical-documents/:documentId",
  authMiddleware,
  roleMiddleware("campaigner", "admin"),
  deleteMedicalDocument
);

export default router;