import Message from "../models/Message.js";
import User from "../models/User.js";

// Send a message
export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const userId = req.user._id;

  try {
    const message = await Message.create({
      chatId,
      sender: userId,
      content,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId }).populate(
      "sender",
      "username"
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
