import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

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
      const newSocket = io("http://localhost:8000", {
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
  }, [token]);

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
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-500 hover:text-blue-600"
        >
          &larr; Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-700">Chat</h1>
      </div>
      <div className="flex-grow bg-white p-4 rounded-lg shadow overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
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
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};
