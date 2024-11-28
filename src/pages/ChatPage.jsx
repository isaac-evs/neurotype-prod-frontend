// src/pages/ChatPage.jsx

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

export const ChatPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      // Connect to the Socket.IO server
      const newSocket = io("https://neurotype-prod-backend.onrender.com", {
        query: { token: encodeURIComponent(token) },
        transports: ["websocket"],
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to Socket.IO server");
      });

      newSocket.on("response", (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: data.message },
        ]);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, navigate]);

  const sendMessage = () => {
    if (socket && input.trim() !== "") {
      socket.emit("message", { message: input });
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "user", content: input },
      ]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <motion.button
          onClick={() => navigate("/dashboard")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-blue-500 hover:text-blue-600 focus:outline-none"
        >
          &larr; Back to Dashboard
        </motion.button>
        <motion.h1
          className="text-3xl font-bold text-gray-700"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Chat
        </motion.h1>
      </div>
      <div className="flex-grow bg-white p-4 rounded-lg shadow overflow-y-auto mb-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              className={`mb-2 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
              initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
              transition={{ duration: 0.3 }}
            >
              <span
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-4 flex">
        <motion.input
          type="text"
          className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          whileFocus={{ scale: 1.02 }}
        />
        <motion.button
          onClick={sendMessage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg focus:outline-none"
        >
          Send
        </motion.button>
      </div>
    </div>
  );
};
