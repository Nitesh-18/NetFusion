// routes/chatRoutes.js
import express from "express";
import { createChat } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-chat", protect, createChat);

export default router;
