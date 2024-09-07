import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { checkPostOwnership } from "../middlewares/ownershipMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js"; // Import upload middleware

const router = express.Router();

// Handle image and video uploads
router.post(
  "/posts",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createPost
);
router.get("/posts", getPosts);
router.put(
  "/posts/:id",
  protect,
  checkPostOwnership,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  updatePost
);
router.delete("/posts/:id", protect, checkPostOwnership, deletePost);

export default router;
