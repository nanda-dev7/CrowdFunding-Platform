import Coupon from "../models/Coupon.js";
import crypto from "crypto";

/**
 * Coupon tiers based on cumulative donation amount.
 * Thresholds are in INR.
 */
const COUPON_TIERS = [
  { minAmount: 5000, discount: 20 },
  { minAmount: 2000, discount: 15 },
  { minAmount: 1000, discount: 10 },
  { minAmount: 500,  discount: 5  },
];

/**
 * Assigns a coupon to a user if their single donation meets a threshold.
 * Returns the created coupon or null if no tier matched.
 */
const assignCoupon = async (userId, donationAmount, donationId) => {
  const tier = COUPON_TIERS.find((t) => donationAmount >= t.minAmount);
  if (!tier) return null;

  // Generate a unique coupon code
  const code = "PAW" + crypto.randomBytes(4).toString("hex").toUpperCase();

  const coupon = await Coupon.create({
    user: userId,
    code,
    discount: tier.discount,
    donation: donationId,
  });

  return coupon;
};

export default assignCoupon;