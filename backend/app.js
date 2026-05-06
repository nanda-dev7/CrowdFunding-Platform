import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import registerRoutes from "./API/Register.js";
import loginRoutes from "./API/Login.js";
import logoutRoutes from "./API/Logout.js";
import refreshTokenRoutes from "./API/RefreshToken.js";
import profileRoutes from "./API/Profile.js";
import campaignRoutes from "./routes/campaign.routes.js";
import donationRoutes from "./routes/donation.routes.js";
import campaignerRoutes from "./routes/campaigner.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

import dashboardRoutes from "./routes/dashboard.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/refresh-token", refreshTokenRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/campaigner", campaignerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", dashboardRoutes);

app.use(errorMiddleware);

export default app;