import mongoose from "mongoose";

const updateSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      enum: ["before", "during", "after"],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const supportingDocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Document title is required"],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["image", "pdf", "other"],
      default: "other",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const expenseSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Expense label is required"],
      trim: true,
    },
    percentage: {
      type: Number,
      required: [true, "Expense percentage is required"],
      min: [0, "Percentage must be at least 0"],
      max: [100, "Percentage must be at most 100"],
    },
  },
  { _id: true }
);

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
    },
    campaignType: {
      type: String,
      enum: [
        "Individual animal rescue",
        "Group animal rescue",
        "Medical treatment",
        "Feeding drive",
        "Vaccination / sterilization drive",
        "Safety equipment drive",
        "Wildlife relocation / conflict prevention",
        "Shelter / foster support",
        "Other animal welfare campaign",
      ],
      required: [true, "Campaign type is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters"],
    },
    category: {
      type: String,
      enum: ["Treatment", "Recovery", "Surgery", "Vaccination"],
      required: [true, "Category is required"],
    },
    goalAmount: {
      type: Number,
      required: [true, "Goal amount is required"],
      min: [100, "Goal must be at least ₹100"],
    },
    raisedAmount: {
      type: Number,
      default: 0,
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
      enum: ["normal", "urgent"],
      default: "normal",
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    animalDetails: {
      type: { type: String },
      name: { type: String },
      approxAge: { type: String },
      gender: { type: String },
      condition: { type: String },
    },
    vetDetails: {
      clinicName: { type: String },
      contactNumber: { type: String },
      diagnosis: { type: String },
      estimatedCost: { type: Number },
    },
    groupWelfareDetails: {
      targetGroup: { type: String },
      estimatedCount: { type: String },
      campaignArea: { type: String },
      actionPlan: { type: String },
      requiredMaterials: { type: String },
    },
    verificationDetails: {
      partnerDetails: { type: String },
      permissionProofUrl: { type: String },
    },
    consentChecked: {
      type: Boolean,
      required: true,
      default: false,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updates: [updateSchema],
    supportingDocuments: [supportingDocumentSchema],
    expenses: [expenseSchema],
    donations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation",
      },
    ],
  },
  { timestamps: true }
);

// Index for fast listing queries
campaignSchema.index({ status: 1, urgencyLevel: 1, createdAt: -1 });
campaignSchema.index({ creator: 1 });

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;