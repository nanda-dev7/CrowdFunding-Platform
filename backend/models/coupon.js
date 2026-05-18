import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    donation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      default: null,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    },
  },
  { timestamps: true }
);

couponSchema.index({ user: 1, isUsed: 1 });

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;