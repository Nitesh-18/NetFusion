import Post from "../models/Post.js";

// Middleware to check if the user is the owner of the post
export const checkPostOwnership = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to perform this action" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
