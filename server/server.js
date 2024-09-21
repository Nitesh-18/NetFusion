import dotenv from "dotenv";
dotenv.config(); // Load environment variables as early as possible

import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport.js"; // Import your Passport config where strategies are set up
import { connect } from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import http from "http"; // Import http module for WebSocket server
import { Server } from "socket.io"; // Import Socket.IO

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your frontend's origin
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(passport.initialize());

// Authentication Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api", protectedRoutes);

// Use the profile routes
app.use("/api/profiles", profileRoutes);

// Use the Post routes
app.use("/api", postRoutes);

// Use the Messages routes
app.use("/api", messagesRoutes);

// Use the Chat routes
app.use("/api/chats", chatRoutes);

// WebSocket server setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle new messages
  socket.on("send_message", async (messageData) => {
    try {
      // Validate messageData
      if (
        !messageData.sender ||
        !messageData.recipient ||
        !messageData.content
      ) {
        console.error("Invalid message data:", messageData);
        socket.emit("error", { message: "Invalid message data" });
        return;
      }

      // Create a new message instance
      const newMessage = new Message({
        sender: messageData.sender, // Expects ObjectId
        recipient: messageData.recipient, // Expects ObjectId
        content: messageData.content,
        mediaUrl: messageData.mediaUrl, // Optional: Only if the message has media
        mediaType: messageData.mediaType, // Optional: Only if the message has media
      });

      // Save the message to the database
      await newMessage.save();

      // Broadcast the message to all clients (or just the relevant chat room)
      io.emit("receive_message", messageData);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("error", { message: "Failed to save message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
