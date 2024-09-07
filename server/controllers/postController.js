import Post from "../models/Post.js";
import User from "../models/User.js";
import {bucket} from "../config/firebaseConfig.js";
import { v4 as uuidv4 } from "uuid";

// Create a new post (unchanged)
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const files = req.files;

    const fileUploads = [];

    if (files.image) {
      const imageFile = files.image[0];
      const imageName = `${uuidv4()}_${imageFile.originalname}`;
      const imageFileUpload = bucket.file(imageName).createWriteStream({
        metadata: {
          contentType: imageFile.mimetype,
        },
      });

      imageFileUpload.end(imageFile.buffer);

      fileUploads.push(
        bucket
          .file(imageName)
          .getSignedUrl({
            action: "read",
            expires: "03-01-2500",
          })
          .then((url) => ({ type: "image", url }))
      );
    }

    if (files.video) {
      const videoFile = files.video[0];
      const videoName = `${uuidv4()}_${videoFile.originalname}`;
      const videoFileUpload = bucket.file(videoName).createWriteStream({
        metadata: {
          contentType: videoFile.mimetype,
        },
      });

      videoFileUpload.end(videoFile.buffer);

      fileUploads.push(
        bucket
          .file(videoName)
          .getSignedUrl({
            action: "read",
            expires: "03-01-2500",
          })
          .then((url) => ({ type: "video", url }))
      );
    }

    const uploadedFiles = await Promise.all(fileUploads);

    const newPost = new Post({
      user: req.user._id,
      content,
      image: uploadedFiles.find((file) => file.type === "image")?.url,
      video: uploadedFiles.find((file) => file.type === "video")?.url,
    });

    await newPost.save();
    res.status(201).json(newPost);
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

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const files = req.files;
    const fileUploads = [];

    if (files.image) {
      const imageFile = files.image[0];
      const imageName = `${uuidv4()}_${imageFile.originalname}`;
      const imageFileUpload = bucket.file(imageName).createWriteStream({
        metadata: {
          contentType: imageFile.mimetype,
        },
      });

      imageFileUpload.end(imageFile.buffer);

      fileUploads.push(
        bucket
          .file(imageName)
          .getSignedUrl({
            action: "read",
            expires: "03-01-2500",
          })
          .then((url) => ({ type: "image", url }))
      );
    }

    if (files.video) {
      const videoFile = files.video[0];
      const videoName = `${uuidv4()}_${videoFile.originalname}`;
      const videoFileUpload = bucket.file(videoName).createWriteStream({
        metadata: {
          contentType: videoFile.mimetype,
        },
      });

      videoFileUpload.end(videoFile.buffer);

      fileUploads.push(
        bucket
          .file(videoName)
          .getSignedUrl({
            action: "read",
            expires: "03-01-2500",
          })
          .then((url) => ({ type: "video", url }))
      );
    }

    const uploadedFiles = await Promise.all(fileUploads);

    // Update the post with new content and/or media files
    post.content = content || post.content;
    post.image =
      uploadedFiles.find((file) => file.type === "image")?.url || post.image;
    post.video =
      uploadedFiles.find((file) => file.type === "video")?.url || post.video;
    post.updatedAt = Date.now();

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
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
