import React, { useState } from "react";
import "../styles/PostModal.css"; // Assuming you have a custom CSS file

const PostModal = ({ isOpen, onClose, onSubmit, mediaType }) => {
  const [postContent, setPostContent] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ postContent, file, mediaType });
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal-content animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md resize-none"
            rows="4"
            placeholder="Write your post caption..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />

          <div className="flex items-center space-x-4">
            <label
              htmlFor="file-upload"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all"
            >
              Upload {mediaType === "image" ? "Image" : "Video"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept={mediaType === "image" ? "image/*" : "video/*"}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
