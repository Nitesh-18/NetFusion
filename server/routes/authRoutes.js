import express from "express";
import { authUser, registerUser } from "../controllers/authController.js";
import passport from "passport";
import jwt from "jsonwebtoken"; // Import jsonwebtoken package
import User from "../models/User.js";

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
    // Generate a JWT token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  }
);

function generateToken(user) {
  // Generate and return JWT token for authenticated user
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

export default router;
