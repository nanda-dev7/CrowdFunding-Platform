const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const campaignRoutes = require("./routes/campaign.routes");
const donationRoutes = require("./routes/donation.routes");
const campaignerRoutes = require("./routes/campaigner.routes");
const adminRoutes = require("./routes/admin.routes");
const notificationRoutes = require("./routes/notification.routes");
const couponRoutes = require("./routes/coupon.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/campaigner", campaignerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users/me/coupons", couponRoutes);
app.use("/api", dashboardRoutes);

app.use(errorMiddleware);

module.exports = app;