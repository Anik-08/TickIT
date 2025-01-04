"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { useTasks } from "../../context/TaskContext"; 

const NewTaskPage = () => {
  const router = useRouter();
  const { addTask } = useTasks(); 
  const { data: session } = useSession(); 
  const [taskTopic, setTaskTopic] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("low");
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false); 

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      setError("You must be logged in to create a task.");
      return; 
    }

    setLoading(true); 

    const newTask = {
      taskTopic,
      taskDescription,
      deadline,
      priority,
      user: session.user._id, 
    };
    console.log("User id:",session.user._id)
    try {
      // Send the new task to the API
      const res = await fetch("/api/tasks", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
    
      if (res.ok) {
        const data = await res.json();
        
        router.push("/dashboard"); 
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create task.");
      }
    } catch (err) {
      console.log("Error creating task:", err);
      setError("An error occurred while creating the task.");
    } finally {
      setLoading(false); 
    }    
  };

  return (
    <div className="container flex justify-center items-center h-screen min-w-full bg-black text-white">
      <div className="w-full max-w-lg p-8 bg-black text-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {error && <p className="text-red-500">{error}</p>} 
          <div>
            <label className="block text-gray-300">Task Topic</label>
            <input
              type="text"
              name="taskTopic"
              value={taskTopic}
              onChange={(e) => setTaskTopic(e.target.value)}
              required
              className="w-full p-2 border rounded-md bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300">Description</label>
            <textarea
              name="taskDescription"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
              className="w-full p-2 border rounded-md bg-gray-800 text-white"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-300">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              className="w-full p-2 border rounded-md bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-gray-300">Priority</label>
            <select
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
              className="w-full p-2 border rounded-md bg-gray-800 text-white"
            >
              <option value="low">Low</option>
              <option value="mid">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-500 text-white p-2 rounded-md"
              onClick={() => router.push("/dashboard")} // Navigate back to dashboard
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  
  );
};

export default NewTaskPage;
