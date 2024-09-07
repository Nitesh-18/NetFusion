import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { checkPostOwnership } from "../middlewares/ownershipMiddleware.js";
import upload, { uploadToFirebase } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Handle image and video uploads
router.post(
  "/posts",
  protect,
  upload, // Handle file reception
  uploadToFirebase, // Upload files to Firebase
  createPost
);

router.get("/posts", getPosts);

router.put(
  "/posts/:id",
  protect,
  checkPostOwnership,
  upload, // Handle file reception
  uploadToFirebase, // Upload files to Firebase
  updatePost
);

router.delete("/posts/:id", protect, checkPostOwnership, deletePost);

export default router;
