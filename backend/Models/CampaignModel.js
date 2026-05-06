import mongoose from "mongoose";

const updateSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      enum: ["before", "during", "after"],
      required: true,
    },
    text: { type: String, required: true },
    image: { type: String, default: null },
    date: { type: Date, default: Date.now },
  },
  { _id: true }
);

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: ["Emergency", "Medical", "Shelter", "Feeding"],
      required: [true, "Category is required"],
    },
    goalAmount: {
      type: Number,
      required: [true, "Goal amount is required"],
      min: [1, "Goal amount must be positive"],
    },
    raisedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    urgencyLevel: {
      type: String,
      enum: ["normal", "critical", "surgery"],
      default: "normal",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updates: [updateSchema],
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
  },
  { timestamps: true }
);

campaignSchema.index({ status: 1, urgencyLevel: 1 });
campaignSchema.index({ status: 1, createdAt: -1 });
campaignSchema.index({ status: 1, deadline: 1 });
campaignSchema.index({ status: 1, raisedAmount: -1 });
campaignSchema.index({ status: 1, creator: 1 });

export default mongoose.model("Campaign", campaignSchema);