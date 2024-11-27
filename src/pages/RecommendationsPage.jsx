// src/pages/RecommendationsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const RecommendationsPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchRecommendations();
    }
  }, [token]);

  const fetchRecommendations = async () => {
    try {
      const response = await axiosInstance.get("/recommendations/");
      setRecommendations(response.data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Error fetching recommendations");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Recommendations</h1>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index} className="border p-4 mb-2">
            {rec}
          </li>
        ))}
      </ul>
    </div>
  );
};
