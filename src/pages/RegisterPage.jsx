// src/pages/RegisterPage.jsx

import React, { useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import zxcvbn from "zxcvbn"; // Optional: For password strength meter
import { motion, AnimatePresence } from "framer-motion";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Access the login function from AuthContext

  // State variables for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State variables for validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  // State variable for password strength (optional)
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Utility function to validate email format
  const validateEmail = (email) => {
    // Simple regex for email validation
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Handler for password input change to evaluate strength (optional)
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const evaluation = zxcvbn(newPassword);
    setPasswordStrength(evaluation.score); // Score between 0 and 4
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous errors
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setGeneralError("");

    let valid = true;

    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError("Password cannot be empty.");
      valid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      valid = false;
    }

    // Validate confirmation password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    }

    // If validation fails, do not proceed with registration
    if (!valid) {
      return;
    }

    try {
      // Register the user
      const registerResponse = await axiosInstance.post("/register", {
        email: email,
        password: password,
      });

      // Automatically log in the user after successful registration
      const loginResponse = await axiosInstance.post(
        "/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      // Store the token in AuthContext
      login(loginResponse.data.access_token);

      alert("Registration and login successful");

      // Reset form fields
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPasswordStrength(0);

      // Always navigate to select-plan after registration
      navigate("/select-plan"); // Redirect to select plan for all users
    } catch (error) {
      console.error("Registration error:", error);

      // Handle specific error messages from the backend
      if (error.response) {
        // Backend returned an error response
        if (error.response.status === 400) {
          const detail = error.response.data.detail;
          if (detail === "Password must be at least 8 characters long.") {
            setPasswordError(detail);
          } else if (detail === "Email already registered.") {
            setGeneralError(detail);
          } else if (detail === "Password cannot be empty.") {
            setPasswordError(detail);
          } else {
            setGeneralError("Registration failed.");
          }
        } else {
          setGeneralError("An unexpected error occurred. Please try again.");
        }
      } else if (error.request) {
        // No response received from backend
        setGeneralError(
          "No response from server. Please check your connection.",
        );
      } else {
        // Other errors
        setGeneralError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500">
      <motion.form
        className="bg-white p-8 rounded-lg shadow-lg w-80"
        onSubmit={handleSubmit}
        noValidate // Prevent default HTML5 validation
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl mb-4 text-center text-gray-800">Register</h2>

        {/* Email Input */}
        <div className="mb-4">
          <motion.input
            type="email"
            className={`border p-2 w-full rounded ${
              emailError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Mark as required for accessibility
            whileFocus={{ borderColor: "#3B82F6", scale: 1.02 }}
          />
          {/* Email Error Message */}
          <AnimatePresence>
            {emailError && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {emailError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <motion.input
            type="password"
            className={`border p-2 w-full rounded ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange} // Use handler for strength evaluation
            required // Mark as required for accessibility
            minLength={8} // HTML5 attribute for additional validation
            whileFocus={{ borderColor: "#3B82F6", scale: 1.02 }}
          />
          {/* Password Error Message */}
          <AnimatePresence>
            {passwordError && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {passwordError}
              </motion.p>
            )}
          </AnimatePresence>
          {/* Password Strength Meter (Optional) */}
          {password && (
            <motion.div
              className="mt-2"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full bg-gray-300 h-2 rounded">
                <div
                  className={`h-2 rounded ${
                    passwordStrength <= 1
                      ? "bg-red-500"
                      : passwordStrength === 2
                        ? "bg-yellow-500"
                        : passwordStrength === 3
                          ? "bg-blue-500"
                          : "bg-green-500"
                  }`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1 text-gray-700">
                {passwordStrength <= 1 && "Weak"}
                {passwordStrength === 2 && "Fair"}
                {passwordStrength === 3 && "Good"}
                {passwordStrength === 4 && "Strong"}
              </p>
            </motion.div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="mb-4">
          <motion.input
            type="password"
            className={`border p-2 w-full rounded ${
              confirmPasswordError ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            whileFocus={{ borderColor: "#3B82F6", scale: 1.02 }}
          />
          {/* Confirm Password Error Message */}
          <AnimatePresence>
            {confirmPasswordError && (
              <motion.p
                className="text-red-500 text-sm mt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {confirmPasswordError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

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

        {/* Register Button */}
        <motion.button
          className="bg-green-500 text-white p-2 w-full rounded hover:bg-green-600 transition-colors"
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Register
        </motion.button>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
};
