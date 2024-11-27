import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const ChatPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      connectWebSocket();
    }
    // Clean up on unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [token]);

  const connectWebSocket = () => {
    const wsUrl = `ws://localhost:8000/ws/chat?token=${token}`; // Include token in query params
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      if (messageData.type === "response") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", content: messageData.content },
        ]);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      // Optionally implement reconnection logic
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  };

  const sendMessage = () => {
    if (ws && input.trim() !== "") {
      const message = { type: "message", content: input };
      ws.send(JSON.stringify(message));
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
