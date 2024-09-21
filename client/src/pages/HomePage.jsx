import React, { useState, useEffect } from "react";
import PostFeed from "../components/PostFeed";
import ChatSidebar from "../components/ChatSidebar";
import "../styles/HomePage-style.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8080/api/posts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("http://localhost:8080/api/chats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch chats: ${response.status}`);
        }

        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error("Error fetching chats:", error.message);
      }
    };

    fetchPosts();
    fetchChats();
  }, []);

  return (
    <div className="homepage flex bg-gray-100 min-h-screen">
      {/* Chat sidebar on the left */}
      <div className="chat-sidebar w-1/4 p-4 bg-white shadow-md">
        {chats.length === 0 ? (
          <p className="text-center text-gray-500">
            No active chats yet. Start a conversation!
          </p>
        ) : (
          <ChatSidebar chats={chats} />
        )}
      </div>

      {/* Post feed in the middle */}
      <div className="post-feed w-2/4 p-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">
            No posts to display. Be the first to post something!
          </p>
        ) : (
          <PostFeed posts={posts} />
        )}
      </div>

      {/* Placeholder for future components or space */}
      <div className="w-1/4"></div>
    </div>
  );
};

export default HomePage;
