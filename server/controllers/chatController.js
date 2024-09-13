// chatController.js
import Chat from "../models/Chat.js";

// Create a new chat
export const createChat = async (req, res) => {
  const { participants } = req.body;

  try {
    const chat = await Chat.create({ participants });
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
