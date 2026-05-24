import mongoose from "mongoose";

const campaignerRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    campaignerType: {
      type: String,
      required: [true, "Campaigner type is required"],
      enum: ["Individual", "NGO/Nonprofit", "Company", "School/College", "Community Group", "Other"],
    },
    publicDisplayName: {
      type: String,
      required: [true, "Public display name is required"],
      trim: true,
    },
    campaignerReason: {
      type: String,
      required: [true, "Campaigner reason is required"],
      trim: true,
    },
    location: { type: String, required: true },
    animalWelfareRole: { type: String }, // For individual
    organizationType: { type: String }, // For NGO
    authorizedPersonRole: { type: String }, // For NGO
    organizationEmailPhone: { type: String }, // For NGO
    referenceContact: { type: String, required: true },
    payoutMethod: {
      type: String,
      enum: ["upi", "bank_account"],
      required: true,
    },
    upiId: { type: String },
    bankDetails: {
      accountHolderName: String,
      bankName: String,
      accountNumber: String,
      ifscCode: String,
    },
    // Files
    verificationDocumentUrl: { type: String }, // Legacy field
    identityProofUrl: { type: String }, // Individual
    animalWelfareProofUrl: { type: String, required: true },
    payoutProofUrl: { type: String, required: true },
    organizationProofUrl: { type: String }, // NGO
    authorizationLetterUrl: { type: String }, // NGO
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