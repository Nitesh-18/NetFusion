import Chat from "../models/Chat.js";
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
      mediaUrl: req.mediaUrls || [], // Handle media URLs as an array
    };

    const message = await Message.create(messageData);

    // Add the newly created message to the Chat schema's messages array
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id },
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a message
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user._id; // Current user ID (sender)

  try {
    // Find the message by ID
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the current user is the sender of the message
    if (message.sender.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this message" });
    }

    // Delete the message
    await Message.findByIdAndDelete(messageId); // Use findByIdAndDelete for deletion

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to edit a message
export const editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.user._id; // Current user ID (sender)

  try {
    // Find the message by ID
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Check if the current user is the sender of the message
    if (message.sender.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this message" });
    }

    // Update the message content if provided
    if (content) {
      message.content = content;
    }

    // Handle media update if a new media file is uploaded
    if (req.file) {
      message.mediaUrl = req.mediaUrl;
      message.mediaType = req.file.mimetype.startsWith("image/")
        ? "image"
        : "video";
    }

    // Save the updated message
    const updatedMessage = await message.save();

    res.status(200).json(updatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get messages by chatId
export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Find the chat by chatId and populate the messages
    const chat = await Chat.findById(chatId).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } },
    });

    if (!chat || chat.messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for this chat." });
    }

    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
