// import express from "express";
// import { getDonorDashboard } from "../controllers/donorDashboard.controller.js";
// import { getCampaignerDashboard } from "../controllers/campaigner.controller.js";
// import authMiddleware from "../middleware/auth.middleware.js";
// import roleMiddleware from "../middleware/role.middleware.js";

// const router = express.Router();

// /**
//  * GET /api/users/me/dashboard
//  * Accessible by any authenticated user (donor by design).
//  */
// router.get(
//   "/users/me/dashboard",
//   authMiddleware,
//   getDonorDashboard
// );

// /**
//  * GET /api/campaigner/dashboard
//  * Accessible by campaigner and admin roles only.
//  */
// router.get(
//   "/campaigner/dashboard",
//   authMiddleware,
//   roleMiddleware("campaigner", "admin"),
//   getCampaignerDashboard
// );

// export default router;


import express from "express";
import { getDonorDashboard } from "../controllers/dashboard.controller.js";
import { getMyDonations } from "../controllers/donation.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/users/me/dashboard
router.get("/users/me/dashboard", authMiddleware, getDonorDashboard);

// GET /api/users/me/donations
router.get("/users/me/donations", authMiddleware, getMyDonations);

export default router;