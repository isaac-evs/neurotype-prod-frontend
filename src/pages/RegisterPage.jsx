// src/pages/RegisterPage.jsx
import React, { useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Access the login function from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register the user
      await axiosInstance.post("/register", {
        email: email,
        password: password,
      });

      // Automatically log in the user after successful registration
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

      alert("Registration and login successful");
      navigate("/select-plan"); // Redirect to select plan after successful registration and login
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error registering user");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        className="bg-white p-6 rounded shadow-md w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4 text-center">Register</h2>
        <input
          type="email"
          className="border p-2 w-full mb-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-green-500 text-white p-2 w-full rounded"
          type="submit"
        >
          Register
        </button>
        <div className="mt-4 text-center">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
