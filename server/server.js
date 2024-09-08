import dotenv from "dotenv";
dotenv.config(); // Load environment variables as early as possible

import express from "express";
import passport from "passport";
import { connect } from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js"; // Import protected routes
import http from "http"; // Import http module for WebSocket server
import { Server } from "socket.io"; // Import Socket.IO

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

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

// WebSocket server setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Load previous messages (optional)
  // Message.find().then(messages => {
  //   socket.emit('load_messages', messages);
  // });

  // Handle new messages
  socket.on("send_message", async (messageData) => {
    // Save message to database
    // const newMessage = new Message(messageData);
    // await newMessage.save();
    io.emit("receive_message", messageData); // Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
