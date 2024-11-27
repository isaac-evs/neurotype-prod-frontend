// src/pages/SelectPlanPage.jsx
import React, { useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const SelectPlanPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [plan, setPlan] = useState("lite");

  if (!token) {
    navigate("/login");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      alert("Plan selected successfully");
      navigate("/profile");
    } catch (error) {
      console.error(
        "Plan selection error:",
        error.response?.data || error.message,
      );
      alert("Error selecting plan");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4 text-center">Select Your Plan</h2>
        <select
          className="border p-2 w-full mb-4"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        >
          <option value="lite">Lite</option>
          <option value="plus">Plus</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded"
        >
          Confirm Plan
        </button>
      </form>
    </div>
  );
};
