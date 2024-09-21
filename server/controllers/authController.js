import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Return token in response and set it in Authorization header
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token, // return the token so client can store it
      redirectUrl: "/home",
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
  } else {
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
        redirectUrl: "/setup-profile",
      });
    } else {
      // Handle duplicate key error
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }
      res.status(400).json({ message: "Invalid user data" });
    }
  }
});

// Controller for setting up the user profile
const setupProfile = async (req, res) => {
  const { username, bio, followIds } = req.body;
  const userId = req.user._id; // The authenticated user

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  if (!bio) {
    return res.status(400).json({ message: "Bio is required" });
  }

  try {
    // Fetch the user to check if they are new and need profile setup
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user profile is already set up
    if (user.username && user.bio) {
      return res.status(400).json({ message: "Profile already set up" });
    }

    // Update the user's profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        bio,
        avatar: req.avatarUrl || null,
        $addToSet: { following: followIds || [] },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Profile setup successfully", user: updatedUser });
  } catch (error) {
    console.error("Error setting up the profile:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const suggestUsernames = async (req, res) => {
  const { query } = req.query; // Get the query parameter from the request

  // Validate the query parameter
  if (typeof query !== "string" || query.trim() === "") {
    return res
      .status(400)
      .json({
        message: "Query parameter is required and must be a non-empty string",
      });
  }

  try {
    // Escape special characters in the query string
    const escapedQuery = query.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");

    // Find names starting with the query parameter
    const suggestions = await User.find({
      name: { $regex: `^${escapedQuery}`, $options: "i" }, // Case-insensitive match
    }).limit(10); // Limit to 10 suggestions

    // Send back the list of names
    res.json({
      suggestions: suggestions.map((user) => user.name),
      count: suggestions.length,
    });
  } catch (error) {
    console.error("Error fetching username suggestions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { authUser, registerUser, setupProfile, suggestUsernames };
