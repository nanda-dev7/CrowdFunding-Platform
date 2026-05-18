// import express from "express";
// import {
//   createOrder,
//   confirmDonation,
//   getMyDonations,
//   getMyCoupons,
// } from "../controllers/donation.controller.js";
// import authMiddleware from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.post("/create-order", authMiddleware, createOrder);
// router.post("/confirm", authMiddleware, confirmDonation);

// // User donation history
// router.get("/me", authMiddleware, getMyDonations);

// export default router;



import express from "express";
import {
  createOrder,
  confirmDonation,
  getMyDonations,
} from "../controllers/donation.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createOrder);
router.post("/confirm", authMiddleware, confirmDonation);
router.get("/me", authMiddleware, getMyDonations);

export default router;