import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const TestChat = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("Hello from the React client!");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to server");
    });

    newSocket.on("receive_message", (message) => {
      console.log("Message from server:", message);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    newSocket.on("error", (error) => {
      console.error("Error:", error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSendMessage = async () => {
    const formData = new FormData();
    formData.append("content", message);
    if (file) {
      formData.append(file.type.startsWith("image/") ? "image" : "video", file);
    }

    try {
      await axios.post("http://localhost:8080/api/messages", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Message sent!");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleSendMessage}>Send Message</button>
    </div>
  );
};

export default TestChat;
