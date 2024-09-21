import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard"; // Import PostCard component

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data } = await axios.get("http://localhost:8080/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Unexpected response format for posts", data);
          setPosts([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts.");
        setPosts([]); // Ensure it's always an array
      }
    };

    fetchPosts();
  }, []);

  if (!posts || posts.length === 0) {
    return <div className="text-center text-gray-500">No posts to display yet.</div>;
  }

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <PostCard post={post} /> {/* Render PostCard component */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PostFeed;
