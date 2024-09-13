import express from "express";
import { sendMessage, getMessages } from "../controllers/messagesController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { uploadMessageMedia } from "../middlewares/messageUploadMiddleware.js";

const router = express.Router();

// Route to send a message with optional media
router.post("/messages", protect, uploadMessageMedia, sendMessage);

// Get chat messages between two users
router.get("/messages/:chatId", protect, getMessages);

export default router;
