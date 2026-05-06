import { Schema, model } from "mongoose";

const donationSchema = new Schema(
  {
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: [true, "Campaign ID is required"],
    },
    donor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Donor ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Donation amount is required"],
      min: [1, "Donation amount must be greater than 0"],
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Donation", donationSchema);
