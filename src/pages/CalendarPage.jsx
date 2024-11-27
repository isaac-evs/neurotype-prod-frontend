import React, { useState, useEffect, useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const CalendarPage = () => {
  const localizer = momentLocalizer(moment);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchEmotionSummaries();
    }
  }, [token]);

  const fetchEmotionSummaries = async (startDate, endDate) => {
    try {
      // If dates are not provided, use current month's range
      if (!startDate || !endDate) {
        startDate = moment().startOf("month").format("YYYY-MM-DD");
        endDate = moment().endOf("month").format("YYYY-MM-DD");
      }

      const response = await axiosInstance.get("/notes/emotions-summary", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });

      // Map the data to events
      const eventsData = response.data.map((item) => ({
        title: "", // We'll use custom rendering for events
        start: new Date(item.date),
        end: new Date(item.date),
        allDay: true,
        prevalentEmotion: item.prevalent_emotion,
      }));

      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching emotion summaries:", error);
      alert("Error fetching emotion summaries");
    }
  };

  const eventPropGetter = (event) => {
    // Set background color based on prevalent emotion
    let backgroundColor = "#fff";
    switch (event.prevalentEmotion) {
      case "happy":
        backgroundColor = "#34D399"; // Green
        break;
      case "calm":
        backgroundColor = "#60A5FA"; // Blue
        break;
      case "sad":
        backgroundColor = "#FBBF24"; // Yellow
        break;
      case "upset":
        backgroundColor = "#EF4444"; // Red
        break;
      default:
        backgroundColor = "#E5E7EB"; // Gray
    }

    return {
      style: {
        backgroundColor,
        border: "none",
        color: "white",
        borderRadius: "8px",
        textAlign: "center",
        padding: "2px",
      },
    };
  };

  // Custom event component to display emotion icons
  const EmotionEvent = ({ event }) => {
    let emoji = "";
    switch (event.prevalentEmotion) {
      case "happy":
        emoji = "😊";
        break;
      case "calm":
        emoji = "😌";
        break;
      case "sad":
        emoji = "😢";
        break;
      case "upset":
        emoji = "😠";
        break;
      default:
        emoji = "❓";
    }

    return <span style={{ fontSize: "1.5em" }}>{emoji}</span>;
  };

  const handleRangeChange = (range) => {
    let startDate, endDate;

    if (range.start && range.end) {
      // Week or Day view
      startDate = moment(range.start).format("YYYY-MM-DD");
      endDate = moment(range.end).format("YYYY-MM-DD");
    } else if (range instanceof Date) {
      // Month view
      startDate = moment(range).startOf("month").format("YYYY-MM-DD");
      endDate = moment(range).endOf("month").format("YYYY-MM-DD");
    } else {
      // Default to current month
      startDate = moment().startOf("month").format("YYYY-MM-DD");
      endDate = moment().endOf("month").format("YYYY-MM-DD");
    }

    fetchEmotionSummaries(startDate, endDate);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-500 hover:text-blue-600"
        >
          &larr; Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-700">Calendar</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          components={{
            event: EmotionEvent,
          }}
          eventPropGetter={eventPropGetter}
          style={{ height: "80vh" }}
          onRangeChange={handleRangeChange}
        />
      </div>
    </div>
  );
};
