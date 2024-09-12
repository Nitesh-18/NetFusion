import React, { useEffect } from "react";
import { io } from "socket.io-client";

const TestChat = () => {
  useEffect(() => {
    const socket = io("http://localhost:8080"); // Make sure the URL matches your server's

    socket.on("connect", () => {
      console.log("Connected to server");

      // Send a test message
      socket.emit("send_message", {
        sender: "64f2bcf75bceb1d3f9a89129", // Replace with actual ObjectId
        recipient: "64f2bcf75bceb1d3f9a89130", // Replace with actual ObjectId
        content: "Hello from the React client!",
      });
    });

    socket.on("receive_message", (message) => {
      console.log("Message from server:", message);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("error", (error) => {
      console.error("Error:", error);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Testing WebSocket Connection</div>;
};

export default TestChat;
