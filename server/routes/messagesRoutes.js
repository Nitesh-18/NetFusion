import express from "express";
import { sendMessage, getMessages, editMessage, deleteMessage } from "../controllers/messagesController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadMessageMedia } from "../middlewares/messageUploadMiddleware.js";

const router = express.Router();

// Route to send a message with optional media
router.post("/messages", protect, uploadMessageMedia, sendMessage);

// Get chat messages between two users
router.get("/messages/:chatId", protect, getMessages);

// Route to delete a message
router.delete("/messages/:messageId", protect, deleteMessage);

// Route to edit a message
router.put("/messages/:messageId", protect, uploadMessageMedia, editMessage);

export default router;
