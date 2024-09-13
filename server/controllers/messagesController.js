import Message from "../models/Message.js";
import { getRecipientIdFromChatId } from "../utils/chatUtils.js"; // Import the function

// Send a message
export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const userId = req.user._id;

  // Ensure we have chatId and content
  if (!chatId || !content) {
    return res
      .status(400)
      .json({ message: "Chat ID and content are required." });
  }

  try {
    // Retrieve recipient ID from chatId
    const recipientId = await getRecipientIdFromChatId(chatId, userId);

    const messageData = {
      chatId,
      sender: userId,
      recipient: recipientId,
      content,
      mediaUrl: req.mediaUrl || null, // Handle media URL
      mediaType:
        req.file && req.file.mimetype.startsWith("image/")
          ? "image"
          : req.file && req.file.mimetype.startsWith("video/")
          ? "video"
          : "none",
    };

    const message = await Message.create(messageData);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages
export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
