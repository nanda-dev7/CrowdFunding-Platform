import mongoose from "mongoose";

const campaignerRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    documentUrl: {
      type: String,
      required: [true, "Document is required"],
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

campaignerRequestSchema.index({ userId: 1, status: 1 });

const CampaignerRequest = mongoose.model("CampaignerRequest", campaignerRequestSchema);
export default CampaignerRequest;