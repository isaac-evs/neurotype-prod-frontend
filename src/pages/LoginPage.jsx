// src/pages/LoginPage.jsx

import React, { useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton"; // Import the new component

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Access the login function from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Authenticate the user
      const data = new URLSearchParams();
      data.append("username", email);
      data.append("password", password);

      const response = await axiosInstance.post("/login", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // Store the token in AuthContext
      login(response.data.access_token);

      alert("Login successful");
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Login error:", error);
      alert("Error logging in");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="border p-2 w-full mb-4"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="border p-2 w-full mb-4"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="bg-green-500 text-white p-2 w-full rounded"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500">
              Register here
            </Link>
          </p>
        </div>
        <div className="mt-6">
          <GoogleLoginButton /> {/* Add the Google Sign-In button */}
        </div>
      </div>
    </div>
  );
};
