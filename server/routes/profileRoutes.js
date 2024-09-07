import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route for getting and updating user profile
router
  .route("/:id")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
