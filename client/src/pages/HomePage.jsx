import React, { useState, useEffect } from "react";
import PostFeed from "../components/PostFeed";
import ChatSidebar from "../components/ChatSidebar";
import PostModal from "../components/PostModal";
import "../styles/HomePage-style.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mediaType, setMediaType] = useState("");

  useEffect(() => {
    fetchPosts();
    fetchChats();
  }, []);

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

  const handleCreatePostClick = () => {
    setShowModal(true); // Open modal when "Create Post" button is clicked
  };

  const handleSubmitPost = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post.");
      }

      const newPost = await response.json();
      setPosts((prevPosts) => [newPost, ...prevPosts]); // Update the state with the new post
    } catch (error) {
      console.error("Error creating post:", error.message);
    }
  };

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
        {/* Create Post Button */}
        <div className="create-post-container mb-4 flex justify-between items-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleCreatePostClick}
          >
            Create Post
          </button>
          <div className="media-dropdown">
            <select
              className="border p-2 rounded-md"
              onChange={(e) => setMediaType(e.target.value)}
            >
              <option value="">Select Media</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
        </div>

        {/* Post feed */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">
            No posts to display. Be the first to post something!
          </p>
        ) : (
          <PostFeed posts={posts} />
        )}
      </div>

      <div className="w-1/4"></div>

      {/* Post Modal */}
      {showModal && (
        <PostModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitPost}
          mediaType={mediaType}
        />
      )}
    </div>
  );
};

export default HomePage;
