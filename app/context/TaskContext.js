"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

// Create a context
const TaskContext = createContext();

// Create a provider component
export const TaskProvider = ({ children }) => {
  const { data: session } = useSession(); // Access the session for user data
  const [tasks, setTasks] = useState([]); // Initial state is an empty array for tasks
  const [completedTasks, setCompletedTasks] = useState([]); // Initial state for completed tasks

  // Memoize the fetchTasks function so it doesn't change on each render
  const fetchTasks = useCallback(async () => {
    if (!session?.user?._id) {
      console.error("No user ID found in session.");
      return; // Return if user ID is not available
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user": session.user._id, // Pass user ID in the header
        },
      });
      const data = await response.json();

      if (response.ok) {
        setTasks(data.tasks); // Set tasks for the specific user
      } else {
        console.log("Error fetching tasks:", data.message);
      }
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  }, [session?.user?._id]); // Only re-run the function if session user ID changes

  // Mark task as completed
  const markTaskAsCompleted = async (taskId) => {
    const taskToComplete = tasks.find((task) => task._id === taskId);

    if (taskToComplete) {
      // Optimistically update state
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, taskToComplete]);

      try {
        // Optional: Sync the change with the backend
        await fetch(`/api/tasks/${taskId}/complete`, { method: "POST" });
      } catch (error) {
        console.error("Error marking task as completed:", error);
      }
    }
  };

  // Fetch tasks when session is available or session changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, session?.user?._id]); // Include session.user._id explicitly

  return (
    <TaskContext.Provider value={{ tasks, completedTasks, setTasks, setCompletedTasks, markTaskAsCompleted }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to access tasks and completed tasks
export const useTasks = () => useContext(TaskContext);
