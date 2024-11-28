// src/pages/DashboardPage.jsx

import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaNotesMedical,
  FaCalendarAlt,
  FaChartLine,
  FaComments,
} from "react-icons/fa";

export const DashboardPage = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/dashboard/");
      const data = response.data;

      // Transform weekly_emotion_data for the chart
      const transformedData = data.weekly_emotion_data.map((item) => ({
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        happy: item.emotions.happy,
        calm: item.emotions.calm,
        sad: item.emotions.sad,
        upset: item.emotions.upset,
      }));
      data.weekly_emotion_data = transformedData;

      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Unable to fetch dashboard data. Please try again later.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <motion.button
          onClick={logout}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Logout
        </motion.button>
      </motion.div>

      {error && (
        <AnimatePresence>
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <span className="block sm:inline">{error}</span>
          </motion.div>
        </AnimatePresence>
      )}

      {dashboardData ? (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* User Information Card */}
          <motion.div
            className="flex items-center bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {dashboardData.profile_photo_url && (
              <motion.img
                src={dashboardData.profile_photo_url}
                alt="Profile"
                className="w-20 h-20 rounded-full mr-6 object-cover"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              />
            )}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome, {dashboardData.name}
              </h2>
              <p className="text-gray-600">
                Total Notes:{" "}
                <span className="font-medium text-gray-800">
                  {dashboardData.total_notes}
                </span>
              </p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Notes Button */}
            <motion.button
              onClick={() => navigate("/notes")}
              className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaNotesMedical className="text-3xl mb-2" />
              <span className="font-semibold">Notes</span>
            </motion.button>

            {/* Calendar Button */}
            <motion.button
              onClick={() => navigate("/calendar")}
              className="flex flex-col items-center bg-green-500 hover:bg-green-600 text-white px-4 py-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCalendarAlt className="text-3xl mb-2" />
              <span className="font-semibold">Calendar</span>
            </motion.button>

            {/* Export Data Button */}
            <motion.button
              onClick={() => navigate("/export")}
              className="flex flex-col items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChartLine className="text-3xl mb-2" />
              <span className="font-semibold">Export Data</span>
            </motion.button>

            {/* Chat Button (Visible Only for Plus Plan) */}
            {dashboardData.plan === "plus" && (
              <motion.button
                onClick={() => navigate("/chat")}
                className="flex flex-col items-center bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-6 rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaComments className="text-3xl mb-2" />
                <span className="font-semibold">Chat</span>
              </motion.button>
            )}
          </motion.div>

          {/* Prevalent Emotion Card */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Prevalent Emotion Today
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {dashboardData.prevalent_emotion_today || "No data"}
            </p>
          </motion.div>

          {/* Weekly Emotion Counts */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Emotion Counts This Week
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Happy */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <p className="text-3xl font-bold text-green-500">
                  {dashboardData.emotion_counts.happy}
                </p>
                <p className="text-gray-600">Happy</p>
              </motion.div>
              {/* Calm */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <p className="text-3xl font-bold text-blue-500">
                  {dashboardData.emotion_counts.calm}
                </p>
                <p className="text-gray-600">Calm</p>
              </motion.div>
              {/* Sad */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <p className="text-3xl font-bold text-yellow-500">
                  {dashboardData.emotion_counts.sad}
                </p>
                <p className="text-gray-600">Sad</p>
              </motion.div>
              {/* Upset */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <p className="text-3xl font-bold text-red-500">
                  {dashboardData.emotion_counts.upset}
                </p>
                <p className="text-gray-600">Upset</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Weekly Emotion Chart */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Weekly Emotion Chart
            </h3>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <BarChart
                  data={dashboardData.weekly_emotion_data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#4A5568" />
                  <YAxis stroke="#4A5568" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="happy" fill="#34D399" name="Happy" />
                  <Bar dataKey="calm" fill="#60A5FA" name="Calm" />
                  <Bar dataKey="sad" fill="#FBBF24" name="Sad" />
                  <Bar dataKey="upset" fill="#EF4444" name="Upset" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <svg
              className="animate-spin h-12 w-12 text-indigo-600 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p className="text-lg text-gray-500">Loading dashboard...</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
