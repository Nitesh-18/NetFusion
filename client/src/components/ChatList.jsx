import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatWindow from "./ChatWindow";

const ChatList = () => {
  const [chats, setChats] = useState([]); // Initialize as an empty array
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve token
        const { data } = await axios.get("http://localhost:8080/api/chats", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        });

        if (Array.isArray(data)) {
          setChats(data);
        } else {
          console.error("Unexpected response format", data);
          setChats([]); // Set an empty array in case of unexpected format
        }
      } catch (error) {
        console.error("Error fetching chats", error);
        setChats([]); // Ensure it's an empty array on error
      }
    };

    fetchChats();
  }, []);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div>
      {chats.length > 0 ? (
        <>
          {/* List of chats */}
          <ul className="space-y-2">
            {chats.map((chat) => (
              <li
                key={chat._id}
                className="bg-gray-700 p-2 rounded-lg cursor-pointer"
                onClick={() => handleChatClick(chat)}
              >
                {chat.participants.map((user) => user.username).join(", ")}
              </li>
            ))}
          </ul>

          {/* Chat window */}
          {selectedChat && <ChatWindow chat={selectedChat} />}
        </>
      ) : (
        <p>No chats to display</p>
      )}
    </div>
  );
};

export default ChatList;
