// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

const TOKEN_KEY = "access_token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial loading state

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // Fetch user data from backend
          const response = await axiosInstance.get("/users/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
          setToken(null);
          localStorage.removeItem(TOKEN_KEY);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
