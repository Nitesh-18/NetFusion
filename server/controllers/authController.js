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
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      redirectUrl: "/home",
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      redirectUrl: "/setup-profile",
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Controller for setting up the user profile
const setupProfile = async (req, res) => {
  const { username, bio, followIds } = req.body;
  const userId = req.user._id;

  // Validate input
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  if (!bio) {
    return res.status(400).json({ message: "Bio is required" });
  }

  // if (!Array.isArray(followIds) || followIds.length < 5) {        Currently commenting it out, after some existing users get set up, turn it ON !
  //   return res
  //     .status(400)
  //     .json({ message: "You must follow at least 5 users" });
  // }

  try {
    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Get the avatar URL from the upload middleware (if provided)
    const avatarUrl = req.avatarUrl || null;

    // Update the user's profile
    const user = await User.findByIdAndUpdate(
      userId,
      {
        username,
        bio,
        avatar: avatarUrl, // Optional: only update if avatarUrl is provided
        $addToSet: { following: { $each: followIds } }, // Add unique followings
      },
      { new: true } // Return the updated user document
    );

    // Respond with the updated user profile
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export { authUser, registerUser, setupProfile };
