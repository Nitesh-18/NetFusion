// routes/chatRoutes.js
import express from "express";
import { createChat, deleteChat } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a new chat
router.post("/create-chat", protect, createChat);

// Route to delete a chat
router.delete("/delete-chat/:chatId", protect, deleteChat); // Add the deleteChat route

export default router;
