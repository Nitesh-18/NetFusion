import express from "express";
import { createChat, deleteChat, getAllChats } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create a new chat
router.post("/create-chat", protect, createChat);

// Route to delete a chat
router.delete("/delete-chat/:chatId", protect, deleteChat);

// Route to fetch all chats
router.get("/", protect, getAllChats); // Add route to get all chats

export default router;
