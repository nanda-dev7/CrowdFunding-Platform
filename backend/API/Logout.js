import express from "express";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Logout route - for JWT, logout is handled client-side by discarding the token
router.post("/", authMiddleware, async (req, res) => {
  try {
    // Since JWT is stateless, we don't need to do anything server-side
    // The client will discard the token
    res.json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

export default router;