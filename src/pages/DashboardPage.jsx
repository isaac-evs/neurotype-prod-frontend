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
} from "recharts";

export const DashboardPage = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/dashboard/");
      const data = response.data;

      // Transform weekly_emotion_data for the chart
      const transformedData = data.weekly_emotion_data.map((item) => ({
        date: item.date,
        happy: item.emotions.happy,
        calm: item.emotions.calm,
        sad: item.emotions.sad,
        upset: item.emotions.upset,
      }));
      data.weekly_emotion_data = transformedData;

      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      alert("Error fetching dashboard data");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-700">Dashboard</h1>
        <button
          onClick={logout}
          className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </div>
      {dashboardData ? (
        <div className="space-y-8">
          {/* User Info */}
          <div className="flex items-center bg-white p-6 rounded-lg shadow">
            {dashboardData.profile_photo_url && (
              <img
                src={dashboardData.profile_photo_url}
                alt="Profile"
                className="w-16 h-16 rounded-full mr-6 border border-gray-200 shadow-sm"
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
          </div>
          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/notes")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow text-lg"
            >
              Notes
            </button>
            <button
              onClick={() => navigate("/calendar")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded shadow text-lg"
            >
              Calendar
            </button>
            <button
              onClick={() => navigate("/export")}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded shadow text-lg"
            >
              Export Data
            </button>
            {dashboardData.plan === "plus" && (
              <button
                onClick={() => navigate("/chat")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded shadow text-lg"
              >
                Chat
              </button>
            )}
          </div>

          {/* Prevalent Emotion */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Prevalent Emotion Today
            </h3>
            <p className="text-xl font-bold text-indigo-600">
              {dashboardData.prevalent_emotion_today || "No data"}
            </p>
          </div>
          {/* Weekly Emotion Counts */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Emotion Counts This Week
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">
                  {dashboardData.emotion_counts.happy}
                </p>
                <p className="text-gray-600">Happy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">
                  {dashboardData.emotion_counts.calm}
                </p>
                <p className="text-gray-600">Calm</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-500">
                  {dashboardData.emotion_counts.sad}
                </p>
                <p className="text-gray-600">Sad</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-500">
                  {dashboardData.emotion_counts.upset}
                </p>
                <p className="text-gray-600">Upset</p>
              </div>
            </div>
          </div>
          {/* Weekly Emotion Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Weekly Emotion Chart
            </h3>
            <div className="overflow-x-auto">
              <BarChart
                width={600}
                height={300}
                data={dashboardData.weekly_emotion_data}
                className="mx-auto"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                  stroke="#4A5568"
                />
                <YAxis stroke="#4A5568" />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Bar dataKey="happy" fill="#34D399" name="Happy" />
                <Bar dataKey="calm" fill="#60A5FA" name="Calm" />
                <Bar dataKey="sad" fill="#FBBF24" name="Sad" />
                <Bar dataKey="upset" fill="#EF4444" name="Upset" />
              </BarChart>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      )}
    </div>
  );
};
