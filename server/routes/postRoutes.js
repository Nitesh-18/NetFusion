import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { checkPostOwnership } from "../middlewares/ownershipMiddleware.js";
import upload, { uploadToFirebase } from "../middlewares/uploadMiddleware.js"; // Import the updated middleware

const router = express.Router();

router.post("/", protect, upload, uploadToFirebase, createPost);

router.get("/", getPosts);

router.put(
  "/:id",
  protect,
  checkPostOwnership,
  upload,
  uploadToFirebase,
  updatePost
);

router.delete("/:id", protect, checkPostOwnership, deletePost);

export default router;
