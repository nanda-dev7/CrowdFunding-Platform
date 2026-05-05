import { Schema, Model } from "mongoose";


const allowedCategories = [
  "Medical",
  "Education",
  "Startup",
  "Social Cause",
  "Environment",
  "Animal Welfare",
  "Emergency Relief",
];

const campaignSchema = new Scehma({
    title: {
      type: String,
      required: [true, "Campaign title is required"],
      trim: true,
      minlength: [3, "Campaign title must be at least 3 characters"],
      maxlength: [120, "Campaign title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Campaign description is required"],
      trim: true,
      minlength: [10, "Campaign description must be at least 10 characters"],
    },
    category: {
      type: String,
      required: [true, "Campaign category is required"],
      enum: {
        values: allowedCategories,
        message: "Invalid campaign category",
      },
    },
    goalAmount: {
      type: Number,
      required: [true, "Funding goal amount is required"],
      min: [1, "Goal amount must be greater than 0"],
    },
    raisedAmount: {
      type: Number,
      default: 0,
      min: [0, "Raised amount cannot be negative"],
    },
    deadline: {
      type: Date,
      required: [true, "Campaign deadline is required"],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Campaign creator is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "Invalid campaign status",
      },
      default: "pending",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);

campaignSchema.virtual("progressPercentage").get(function () {
  if (!this.goalAmount || this.goalAmount <= 0) {
    return 0;
  }

  return Math.min((this.raisedAmount / this.goalAmount) * 100, 100);
});

export { allowedCategories };
export const CampaignModel = model("user", campaignSchema);
