import express from "express";
import { getMyCoupons } from "../controllers/coupon.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// GET /api/users/me/coupons
router.get("/", getMyCoupons);

export default router;