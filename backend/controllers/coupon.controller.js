import Coupon from "../models/Coupon.js";

// GET /api/users/me/coupons
export const getMyCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ coupons });
  } catch (error) {
    next(error);
  }
};