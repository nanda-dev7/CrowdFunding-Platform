// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import registerRoutes from "./API/Register.js";
// import loginRoutes from "./API/Login.js";
// import logoutRoutes from "./API/Logout.js";
// import refreshTokenRoutes from "./API/RefreshToken.js";
// import profileRoutes from "./API/Profile.js";
// import campaignRoutes from "./routes/campaign.routes.js";
// import donationRoutes from "./routes/donation.routes.js";
// import campaignerRoutes from "./routes/campaigner.routes.js";
// import adminRoutes from "./routes/admin.routes.js";
// import notificationRoutes from "./routes/notification.routes.js";

// import dashboardRoutes from "./routes/dashboard.routes.js";

// import errorMiddleware from "./middleware/error.middleware.js";

// const app = express();

// app.use(express.json());
// app.use(cookieParser());

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true
//   })
// );

// app.use("/api/register", registerRoutes);
// app.use("/api/login", loginRoutes);
// app.use("/api/logout", logoutRoutes);
// app.use("/api/refresh-token", refreshTokenRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/campaigns", campaignRoutes);
// app.use("/api/donations", donationRoutes);
// app.use("/api/campaigner", campaignerRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api", dashboardRoutes);

// app.use(errorMiddleware);

// export default app;



require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Database ─────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// ─── Routes ───────────────────────────────────────────────────────────────────

// Member 1 — Auth (register, login, me, refresh, logout)
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Member 2 — Campaigns (public listing + CRUD + timeline updates)
const campaignRoutes = require("./routes/campaign.routes");
app.use("/api/campaigns", campaignRoutes);

// Member 3 — Donations (create Razorpay order, confirm, my donations, coupons)
const donationRoutes = require("./routes/donation.routes");
app.use("/api/donations", donationRoutes);

// Member 3 — User-scoped donation + coupon endpoints
const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);

// Member 4 — Campaigner application + status
const campaignerRoutes = require("./routes/campaigner.routes");
app.use("/api/campaigner", campaignerRoutes);

// Member 4 — Admin controls (approve/reject, stats, user management)
const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

// Member 5 — Notifications (list, mark read)
const notificationRoutes = require("./routes/notification.routes");
app.use("/api/notifications", notificationRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;