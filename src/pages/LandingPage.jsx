// src/pages/LandingPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our App</h1>
        <p className="text-lg mb-6">
          Your journey begins here. Track your notes and much more!
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-blue-500 text-white px-6 py-2 rounded shadow-md hover:bg-blue-600"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};
