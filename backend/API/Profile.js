import express from "express";
import authMiddleware from "../middlewares/auth.js";
import User from "../Models/UserModel.js";

const router = express.Router();

// GET /api/auth/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // req.user comes from JWT
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile fetched",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;