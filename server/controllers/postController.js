import Post from "../models/Post.js";
import { bucket } from "../config/firebaseConfig.js";
import { v4 as uuidv4 } from "uuid";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const fileUploads = req.uploadedFiles || [];

    const imageUrl = fileUploads.find((file) => file.fieldName === 'image')?.url;
    const videoUrl = fileUploads.find((file) => file.fieldName === 'video')?.url;

    // Check if neither image nor video is provided
    if (!imageUrl && !videoUrl) {
      return res.status(400).json({ message: 'You must upload an image or video to create a post.' });
    }

    const newPost = new Post({
      user: req.user._id, // Assuming you are using a `protect` middleware for authentication
      content,
      image: imageUrl,
      video: videoUrl,
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
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Array to hold filenames of files to delete
    const filesToDelete = [];

    if (post.image) {
      const imageName = decodeURIComponent(
        post.image.split("/").pop().split("?")[0]
      );
      filesToDelete.push(imageName);
      console.log("Image file to delete:", imageName);
    }
    if (post.video) {
      const videoName = decodeURIComponent(
        post.video.split("/").pop().split("?")[0]
      );
      filesToDelete.push(videoName);
      console.log("Video file to delete:", videoName);
    }

    // Delete files from Firebase Storage
    for (const fileName of filesToDelete) {
      try {
        console.log("Attempting to delete file:", fileName);
        await bucket.file(fileName).delete();
        console.log(`Successfully deleted file: ${fileName}`);
      } catch (err) {
        console.error(`Failed to delete file ${fileName}:`, err.message);
      }
    }

    // Remove the post from the database
    await Post.deleteOne({ _id: postId });
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts 
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username avatar") // Populate the username from the user field
      .sort({ createdAt: -1 }); // Sort by newest posts

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
