import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const NotesPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchNotes();
    }
  }, [token]);

  const fetchNotes = async () => {
    try {
      const response = await axiosInstance.get("/notes/");
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      alert("Error fetching notes");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Back to Dashboard Button */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-500 hover:text-blue-600"
        >
          &larr; Back to Dashboard
        </button>
        <Link
          to="/notes/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
        >
          + New Note
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Your Notes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <Link
            key={note.id}
            to={`/notes/${note.id}`}
            className="block bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {note.title || "Untitled Note"}
            </h2>
            <p className="text-gray-600 line-clamp-3">{note.text}</p>
          </Link>
        ))}
      </div>
      {notes.length === 0 && (
        <p className="text-gray-500 text-center mt-6">
          No notes found. Click{" "}
          <Link to="/notes/new" className="text-blue-500">
            here
          </Link>{" "}
          to create your first note.
        </p>
      )}
    </div>
  );
};
