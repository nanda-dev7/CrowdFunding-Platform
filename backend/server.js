import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import registerRoute from "./API/Register.js";
import loginRoute from "./API/Login.js";
import profileRoute from "./API/Profile.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/profile", profileRoute);

const PORT = process.env.PORT || 5000;

// DB + server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("DB error:", error.message);
  }
};

startServer();