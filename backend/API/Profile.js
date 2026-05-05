import express from "express";
import authMiddleware from "../middlewares/auth.js";
import User from "../Models/UserModel.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      message: "Profile fetched",
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;