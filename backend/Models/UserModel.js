// import { Schema, model } from "mongoose";

// const UserSchema = new Schema({
//   name: {
//     type: String,
//     required: [true, "Name is required"],
//     trim: true,
//     minlength: [2, "Name must be at least 2 characters"],
//     maxlength: [50, "Name cannot exceed 50 characters"]
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [
//       /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
//       "Please enter a valid email"
//     ]
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//     minlength: [6, "Password must be at least 6 characters"],
//     select: false // Don't include password in queries by default
//   },
//   role: {
//     type: String,
//     enum: {
//       values: ["donor", "creator", "admin"],
//       message: "Role must be either donor, creator, or admin"
//     },
//     default: "donor"
//   }
// }, {
//   timestamps: true
// });

// export default model("User", UserSchema);

const mongoose = require("mongoose");

/**
 * User model — owned by Member 1 (src/models/User.js).
 * Stub here so Member 2's auth middleware and campaign.creator populate resolve.
 *
 * Member 1's full implementation adds:
 *   - bcrypt password hashing hooks
 *   - refreshToken rotation logic
 *   - email uniqueness validation
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    // Member 1 spec: store as passwordHash, never return it
    passwordHash: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    // Member 1 spec: default donor; Member 4 upgrades to campaigner on approval
    role: {
      type: String,
      enum: {
        values: ["donor", "campaigner", "admin"],
        message: "Role must be either donor, creator, or admin",
      },
      default: "donor",
    },
    // Member 4: set true when admin approves campaigner request
    isVerifiedCampaigner: { type: Boolean, default: false },
    // Member 1: httpOnly cookie refresh token flow
    refreshToken: { type: String, select: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
