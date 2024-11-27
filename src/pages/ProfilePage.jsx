// src/pages/ProfilePage.jsx
import React, { useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a FormData object to handle file upload
      const formData = new FormData();
      if (name) formData.append("name", name);
      if (file) formData.append("file", file);

      // Make a PUT request to the /profile endpoint
      await axiosInstance.put("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Profile updated successfully");
      navigate("/dashboard"); // Redirect to the dashboard after updating profile
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data || error.message,
      );
      alert("Error updating profile");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-80"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2 className="text-2xl mb-4 text-center">Update Your Profile</h2>
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Profile Photo</label>
          <input
            type="file"
            className="border p-2 w-full"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};
