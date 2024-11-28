// src/pages/ProfilePage.jsx

import React, { useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  // State variables for validation errors
  const [nameError, setNameError] = useState("");
  const [fileError, setFileError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setNameError("");
    setFileError("");
    setGeneralError("");
    setSuccessMessage("");

    let valid = true;

    // Validate name (optional)
    // Uncomment if name is required
    // if (!name.trim()) {
    //   setNameError("Name cannot be empty.");
    //   valid = false;
    // }

    // Validate file (optional)
    if (file && !file.type.startsWith("image/")) {
      setFileError("Only image files are allowed.");
      valid = false;
    }

    // If validation fails, do not proceed with profile update
    if (!valid) {
      return;
    }

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

      setSuccessMessage("Profile updated successfully!");
      navigate("/dashboard"); // Redirect to the dashboard after updating profile
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data || error.message,
      );
      setGeneralError("Error updating profile");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
      <motion.form
        className="bg-white p-8 rounded-lg shadow-lg w-80"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl mb-4 text-center text-gray-800">
          Update Your Profile
        </h2>

        {/* Name Input */}
        <div className="mb-4">
          <motion.input
            type="text"
            className={`border p-2 w-full rounded ${
              nameError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            whileFocus={{ borderColor: "#6B7280", scale: 1.02 }}
          />
          {/* Name Error Message */}
          <AnimatePresence>
            {nameError && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {nameError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Photo Input */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-700">Profile Photo</label>
          <motion.input
            type="file"
            className={`border p-2 w-full rounded ${
              fileError ? "border-red-500" : "border-gray-300"
            }`}
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            whileFocus={{ borderColor: "#6B7280", scale: 1.02 }}
          />
          {/* File Error Message */}
          <AnimatePresence>
            {fileError && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {fileError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.p
              className="text-green-500 text-sm mb-4 text-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {successMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* General Error Message */}
        <AnimatePresence>
          {generalError && (
            <motion.p
              className="text-red-500 text-sm mb-4 text-center"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {generalError}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Save Profile Button */}
        <motion.button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full rounded hover:bg-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Save Profile
        </motion.button>
      </motion.form>
    </div>
  );
};
