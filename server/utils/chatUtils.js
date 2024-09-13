import Chat from "../models/Chat.js";

// Function to get recipient ID from chatId
export const getRecipientIdFromChatId = async (chatId, senderId) => {
  try {
    const chat = await Chat.findById(chatId).select("participants");

    if (!chat) {
      throw new Error("Chat not found");
    }

    const { participants } = chat;

    if (!participants || participants.length !== 2) {
      throw new Error(
        "Participants array is invalid or does not have exactly two members"
      );
    }

    // Find the recipient ID by excluding the sender's ID
    const recipientId = participants.find(
      (participantId) => participantId.toString() !== senderId.toString()
    );

    if (!recipientId) {
      throw new Error("Recipient not found");
    }

    return recipientId;
  } catch (error) {
    throw new Error("Error retrieving recipient ID: " + error.message);
  }
};
