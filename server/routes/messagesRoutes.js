import express from "express";
import { sendMessage, getMessages } from "../controllers/messagesController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Send a message
router.post("/messages", protect, sendMessage);

// Get chat messages between two users
router.get("/messages/:chatId", protect, getMessages);

export default router;
