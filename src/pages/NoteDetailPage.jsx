import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const NoteDetailPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { noteId } = useParams();
  const [note, setNote] = useState({ text: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (noteId === "new") {
      setIsEditing(true);
    } else {
      fetchNote();
    }
  }, [token, noteId]);

  const fetchNote = async () => {
    try {
      const response = await axiosInstance.get(`/notes/`);
      const noteData = response.data.find((n) => n.id === parseInt(noteId));
      setNote(noteData || { text: "" });
    } catch (error) {
      console.error("Error fetching note:", error);
      alert("Error fetching note");
    }
  };

  const handleSave = async () => {
    try {
      if (noteId === "new") {
        await axiosInstance.post("/notes/", {
          text: note.text,
        });
      } else {
        await axiosInstance.put(`/notes/${noteId}`, {
          text: note.text,
        });
      }
      alert("Note saved");
      navigate("/notes");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Error saving note");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/notes/${noteId}`);
      alert("Note deleted");
      navigate("/notes");
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Error deleting note");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <button
        onClick={() => navigate("/notes")}
        className="text-blue-500 hover:text-blue-600 mb-4"
      >
        &larr; Back to Notes
      </button>
      <div className="bg-white p-6 rounded-lg shadow">
        {isEditing || noteId === "new" ? (
          <>
            <textarea
              className="border border-gray-300 rounded p-4 w-full h-64 focus:outline-none focus:ring focus:ring-blue-200 mb-4"
              value={note.text}
              onChange={(e) => setNote({ ...note, text: e.target.value })}
              placeholder="Write your note here..."
            ></textarea>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow"
              >
                Save
              </button>
              {noteId !== "new" && (
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow"
                >
                  Delete
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-700 text-lg mb-4">{note.text}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded shadow"
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
};
