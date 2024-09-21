// chatController.js
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// Controller to fetch all chats
export const getAllChats = async (req, res) => {
  try {
    // Fetch all chats and populate participants and messages
    const chats = await Chat.find()
      .populate("participants", "username email") // populate participant details
      .populate("messages"); // populate messages

    // Send the chats data as response
    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Failed to fetch chats." });
  }
};

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

// Controller function to delete a chat
export const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user._id;

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the user is a participant in the chat
    const isParticipant = chat.participants.some((participant) =>
      participant.equals(userId)
    );

    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this chat" });
    }

    // Delete all messages associated with the chat
    await Message.deleteMany({ _id: { $in: chat.messages } });

    // Delete the chat itself
    await Chat.findByIdAndDelete(chatId);

    res
      .status(200)
      .json({ message: "Chat and associated messages deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
