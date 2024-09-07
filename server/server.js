import dotenv from "dotenv";
dotenv.config(); // Load environment variables as early as possible

import express from "express";
import passport from "passport";
import { connect } from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import "./config/passport.js"; // Make sure this is the correct relative path
import protectedRoutes from "./routes/protectedRoutes.js"; // Import protected routes

const app = express();

app.use(cors());
app.use(express.json());

connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(passport.initialize());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api", protectedRoutes);

// Use the profile routes
app.use("/api/profiles", profileRoutes);

// Use the Post routes
app.use("/api", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
