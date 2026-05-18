// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import authRoutes from "./routes/auth.routes.js";
// import campaignRoutes from "./routes/campaign.routes.js";
// import donationRoutes from "./routes/donation.routes.js";
// import campaignerRoutes from "./routes/campaigner.routes.js";
// import adminRoutes from "./routes/admin.routes.js";
// import notificationRoutes from "./routes/notification.routes.js";
// import couponRoutes from "./routes/coupon.routes.js";
// import dashboardRoutes from "./routes/dashboard.routes.js";
// import errorMiddleware from "./middleware/error.middleware.js";

// const app = express();

// // ── Core middleware ───────────────────────────────────────────────────────────
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // ── Health check ─────────────────────────────────────────────────────────────
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
// });

// // ── API routes ────────────────────────────────────────────────────────────────
// app.use("/api/auth", authRoutes);
// app.use("/api/campaigns", campaignRoutes);
// app.use("/api/donations", donationRoutes);
// app.use("/api/campaigner", campaignerRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/users/me/coupons", couponRoutes);

// // Dashboard routes register /api/users/me/dashboard and /api/users/me/donations
// app.use("/api", dashboardRoutes);

// // ── 404 handler ───────────────────────────────────────────────────────────────
// app.use((req, res) => {
//   res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
// });

// // ── Global error handler ──────────────────────────────────────────────────────
// app.use(errorMiddleware);

// export default app;




import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import campaignRoutes from "./routes/campaign.routes.js";
import donationRoutes from "./routes/donation.routes.js";
import campaignerRoutes from "./routes/campaigner.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

// ── Core middleware ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/campaigner", campaignerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// Dashboard routes register /api/users/me/dashboard and /api/users/me/donations
app.use("/api", dashboardRoutes);

// ── Serve Frontend ────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "../AniRescue-Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../AniRescue-Frontend/dist", "index.html"));
  });
}

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorMiddleware);

export default app;