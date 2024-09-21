import React from "react";
import { formatDistanceToNowStrict } from "date-fns";
import defaultAvatar from "../assets/Default-Avatar.png";

const PostCard = ({ post }) => {
  const timeAgo = formatDistanceToNowStrict(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
      {/* User Info */}
      <div className="flex items-center mb-4">
        <img
          className="h-8 w-8 rounded-full mr-3"
          src={post.user.avatar || defaultAvatar}
          alt="User Avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultAvatar;
          }}
        />
        <div>
          <h3 className="text-md font-semibold">{post.user.username}</h3>
          <p className="text-gray-400 text-xs">Posted {timeAgo}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-gray-700 mb-3">{post.content}</p>

      {/* Post Image */}
      {post.image && (
        <img
          className="w-full h-60 object-cover rounded-md mb-3"
          src={post.image}
          alt="Post Image"
        />
      )}

      {/* Post Video */}
      {post.video && (
        <video controls className="w-full h-60 object-cover rounded-md mb-3">
          <source src={post.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Like, Comment, and Share Buttons */}
      <div className="flex justify-around text-gray-600 mt-4">
        <button className="flex items-center space-x-1">
          <i className="far fa-heart"></i>
          <span>Like</span>
        </button>
        <button className="flex items-center space-x-1">
          <i className="far fa-comment"></i>
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1">
          <i className="far fa-share-square"></i>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
