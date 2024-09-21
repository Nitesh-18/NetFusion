// src/components/ChatWindow.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatWindow = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${chat._id}`);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    fetchMessages();
  }, [chat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post("/api/messages", {
        chatId: chat._id,
        content: newMessage,
      });
      setNewMessage("");
      setMessages((prev) => [...prev, { content: newMessage }]);
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 h-full">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <p>{message.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l-lg"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
