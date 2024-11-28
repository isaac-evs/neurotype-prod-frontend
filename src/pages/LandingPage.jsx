// src/pages/LandingPage.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <motion.div
        className="text-center bg-white p-10 rounded-lg shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <motion.h1
          className="text-4xl font-bold mb-4 text-gray-800"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          NEUROTYPE
        </motion.h1>
        <motion.p
          className="text-lg mb-6 text-gray-600"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Your journey begins here. Track your health with the help of NLP
        </motion.p>
        <motion.button
          onClick={handleGetStarted}
          className="bg-blue-500 text-white px-6 py-2 rounded shadow-md hover:bg-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
};
