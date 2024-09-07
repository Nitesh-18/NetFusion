import Post from "../models/Post.js";
import { bucket } from "../config/firebaseConfig.js";
import { v4 as uuidv4 } from "uuid";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const fileUploads = req.uploadedFiles || [];

    const newPost = new Post({
      user: req.user._id,
      content,
      image: fileUploads.find((file) => file.fieldName === "image")?.url,
      video: fileUploads.find((file) => file.fieldName === "video")?.url,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const fileUploads = req.uploadedFiles || [];

    post.content = content || post.content;
    post.image =
      fileUploads.find((file) => file.fieldName === "image")?.url || post.image;
    post.video =
      fileUploads.find((file) => file.fieldName === "video")?.url || post.video;
    post.updatedAt = Date.now();

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Delete associated image and video files from Firebase Storage
    if (post.image) {
      const imageName = post.image.split("/").pop().split("?")[0]; // Extract the file name from URL
      await bucket.file(imageName).delete();
    }

    if (post.video) {
      const videoName = post.video.split("/").pop().split("?")[0]; // Extract the file name from URL
      await bucket.file(videoName).delete();
    }

    await post.remove();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts (unchanged)
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
