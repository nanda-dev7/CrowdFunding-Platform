import express from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  createOrder,
  confirmDonation,
  getUserDonations,
  getDonationById,
} from "../controllers/donationController.js";

const router = express.Router();

// Create a new donation order (requires authentication)
router.post("/create-order", authMiddleware, createOrder);

// Confirm payment for a donation (requires authentication)
router.post("/confirm", authMiddleware, confirmDonation);

// Get a specific donation (requires authentication)
router.get("/:donationId", authMiddleware, getDonationById);

// Get user's donation history (requires authentication)
router.get("/", authMiddleware, getUserDonations);

export default router;
