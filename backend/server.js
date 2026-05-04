import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import registerRoute from "./API/Register.js";
import loginRoute from "./API/Login.js";
import profileRoute from "./API/profile.js";



// load env variables
dotenv.config();

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/auth", profileRoute);

// async DB + server start
const startServer = async () => {
  try {
    // connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    // start server
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });

  } catch (error) {
    console.error("DB error:", error.message);
  }
};

startServer();