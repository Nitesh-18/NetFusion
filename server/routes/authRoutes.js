import express from "express";
import {
  authUser,
  registerUser,
  setupProfile,
} from "../controllers/authController.js";
import passport from "passport";
import jwt from "jsonwebtoken"; // Import jsonwebtoken package
import User from "../models/User.js";
import avatarUploadMiddleware from "../middlewares/avatarUploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", authUser);

router.post("/register", registerUser);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    if (req.authInfo.isNewUser) {
      // If the user is new, redirect them to the setup-profile page
      res.redirect(`http://localhost:5173/setup-profile?token=${token}`);
    } else {
      // If the user is returning, redirect them to the home page
      res.redirect(`http://localhost:5173/home?token=${token}`);
    }
  }
);

// Setup profile route
router.post("/setup-profile", protect, avatarUploadMiddleware, setupProfile);

function generateToken(user) {
  // Generate and return JWT token for authenticated user
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

export default router;
