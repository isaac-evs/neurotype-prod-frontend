// src/pages/DataExportPage.jsx
import React, { useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const DataExportPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/data/export", {
        responseType: "blob", // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "notes.csv"); // Or any other extension
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error exporting data");
    }
  };

  if (!token) {
    navigate("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Export Data</h1>
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Export Notes as CSV
      </button>
    </div>
  );
};
