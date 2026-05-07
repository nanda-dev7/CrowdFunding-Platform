import mongoose from "mongoose";

const CampaignerRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, "Contact is required"],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, "Organization is required"],
      trim: true,
    },
    documentUrl: {
      type: String,
      required: [true, "Document URL is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

CampaignerRequestSchema.index({ userId: 1, status: 1 });

export default mongoose.model("CampaignerRequest", CampaignerRequestSchema);
