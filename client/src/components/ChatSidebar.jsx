// src/components/ChatSidebar.jsx
import React from "react";
import ChatList from "./ChatList";

const ChatSidebar = () => {
  return (
    <div className="p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Chats</h2>
      <ChatList />
    </div>
  );
};

export default ChatSidebar;
