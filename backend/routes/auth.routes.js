import express from "express";



import {
  sendOtp,
  verifyOtp,
} from "../controllers/authController.js";


const router = express.Router();


router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// TODO: Add authentication routes
// - POST /login
// - POST /register
// - POST /refresh-token
// - POST /logout

export default router;
