import React, { useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const ExportDataPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/data/export", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Ensures the response is treated as a file
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: "text/csv" });

      // Create a link element to download the file
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "notes.csv"; // Set the file name
      link.click();
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Failed to export data. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-500 hover:text-blue-600"
        >
          &larr; Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-700">Export Data</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-700 text-lg mb-4">
          Click the button below to download your notes as a CSV file.
        </p>
        <button
          onClick={handleExport}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded shadow"
        >
          Export Notes
        </button>
      </div>
    </div>
  );
};
