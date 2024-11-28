// src/pages/SelectPlanPage.jsx

import React, { useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const SelectPlanPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [plan, setPlan] = useState("lite");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axiosInstance.put(
        "/select-plan",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            plan_in: plan,
          },
        },
      );
      // Optionally, you can update user context or fetch updated user data here
      alert("Plan selected successfully");
      navigate("/profile"); // Redirect to profile after plan selection
    } catch (error) {
      console.error(
        "Plan selection error:",
        error.response?.data || error.message,
      );
      setError("Error selecting plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
      <motion.form
        className="bg-white p-8 rounded-lg shadow-lg w-96"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2
          className="text-2xl mb-6 text-center text-gray-800"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Select Your Plan
        </motion.h2>

        {/* Plan Selection */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <label htmlFor="plan" className="block mb-2 text-gray-700">
            Choose a Plan:
          </label>
          <motion.select
            id="plan"
            className="border p-3 w-full rounded focus:outline-none focus:ring focus:ring-indigo-200"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <option value="lite">Lite - Free</option>
            <option value="plus">Plus - $9.99/month</option>
          </motion.select>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="text-red-500 text-sm mb-4 text-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="bg-blue-500 text-white p-3 w-full rounded hover:bg-blue-600 transition-colors"
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {loading ? "Processing..." : "Confirm Plan"}
        </motion.button>

        {/* Back to Dashboard Link */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.p
            className="text-gray-600"
            whileHover={{ textDecoration: "underline" }}
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              &larr; Back to Dashboard
            </button>
          </motion.p>
        </motion.div>
      </motion.form>
    </div>
  );
};
