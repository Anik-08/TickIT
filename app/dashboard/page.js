"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { useTasks } from "../context/TaskContext"; 

const Page = () => {
  const { data: session, status } = useSession(); 
  const router = useRouter();
  const { tasks, setTasks, completedTasks, setCompletedTasks } = useTasks(); 
  

  useEffect(() => {
    // Fetch tasks only once
    if (session?.user?._id && tasks.length === 0) {
      fetchTasks();
    }

    // Fetch completed tasks for the logged-in user from localStorage
    const storedCompletedTasks = JSON.parse(
      localStorage.getItem(`completedTasks_${session?.user?._id}`) || "[]"
    );
    setCompletedTasks(storedCompletedTasks); // Set completed tasks
  }, [tasks, session]);

  const handleDone = (taskId) => {
    const taskToComplete = tasks.find((task) => task._id === taskId);

    if (taskToComplete) {
      // Remove the task from the TODO list
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      // Add the task to the COMPLETED list
      setCompletedTasks((prevCompletedTasks) => {
        const updatedCompletedTasks = [...prevCompletedTasks, taskToComplete];

        // Store completed tasks for the current user in localStorage
        localStorage.setItem(
          `completedTasks_${session?.user?._id}`,
          JSON.stringify(updatedCompletedTasks)
        );

        return updatedCompletedTasks;
      });
    }
  };

  const fetchTasks = async () => {
    if (!session.user._id) {
      console.log("User ID not found in session.");
      return;
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          user: session.user._id, 
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTasks((prevTasks) => {
          const uniqueTasks = data.tasks.filter(
            (task) => !prevTasks.some((existingTask) => existingTask._id === task._id)
          );
          return [...prevTasks, ...uniqueTasks];
        });
      } else {
        console.log("Error fetching tasks:", data.message);
      }
    } catch (error) {
      console.log("Error fetching tasks:", error);
    }
  };

  // Handling undefined session case
  if (status === "loading") {
    return (
      <div className="grid place-items-center h-screen bg-black text-white">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="grid place-items-center h-full bg-black">
        <div className="bg-amber-50 p-10 text-black flex flex-col gap-4 items-center justify-center rounded-lg shadow-lg">
          <h1 className="font-bold">You are not logged in!</h1>
          <button
            className="bg-red-800 rounded-xl px-4 py-2"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen bg-black gap-4 p-4">
      {/* Sidebar Section */}
      <div className="lg:col-span-2 bg-[#131010] text-white p-6 rounded-lg shadow-lg flex flex-col lg:h-auto">
        <h1 className="text-2xl font-bold mb-6">User Info</h1>

        <div>
          <p className="mb-2">
            <strong>Name:</strong> <span>{session.user.name}</span>
          </p>
          <p>
            <strong>Email:</strong> <span>{session.user.email}</span>
          </p>
        </div>

        {/* Log Out Button */}
        <button
          className="bg-white text-red-700 hover:bg-red-700 hover:text-white rounded-xl px-6 py-2 mt-6 w-full lg:w-auto"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          Log Out
        </button>
      </div>

      {/* Main Content Section */}
      <div className="lg:col-span-10 h-full flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-white">{session.user.name}&apos;s Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TODO Section */}
          <div className="col-span-2 bg-black rounded-xl p-4 shadow-lg flex flex-col">
            <div className="info flex justify-between items-center rounded-xl bg-[#F0BB78] bg-opacity-30 p-4 shadow-md border-white">
              <h1 className="text-white font-bold text-xl">TODO&apos;s</h1>
              <button
                className="p-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition duration-300"
                onClick={() => router.push("/dashboard/new-task")}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>

            <div className="todos h-auto mt-4 bg-[#543A14] bg-opacity-20 rounded-xl p-4 flex-grow">
              {/* Render tasks dynamically, excluding completed tasks */}
              {tasks.length === 0 ? (
                <div className="text-center text-gray-500">
                  <p>Add your todos here</p>
                  <button
                    onClick={() => router.push("/dashboard/new-task")}
                    className="mt-4 bg-blue-500 text-white rounded-md px-4 py-2"
                  >
                    Add New Task
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {tasks
                    .filter(
                      (task) =>
                        !completedTasks.some(
                          (completed) => completed._id === task._id
                        )
                    ) // Filter out completed tasks
                    .map((task) => (
                      <li
                        key={task._id}
                        className="text-white flex flex-col p-4 rounded-lg bg-[#1f1f1f] border border-gray-700"
                      >
                        <div className="flex flex-col mb-2">
                          <div className="flex items-center justify-between">
                            <strong className="text-xl">{task.taskTopic}</strong>
                            <div className="text-sm text-gray-300 mb-4">
                              {task.deadline}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {task.taskDescription}
                          </div>
                        </div>
                        <div className="flex flex-row justify-between">
                          <button
                            onClick={() => handleDone(task._id)}
                            className="mt-2 w-1/3 border-2 border-purple-700 text-white rounded-md px-2 py-2"
                          >
                            Mark as Done
                          </button>
                          {/* Priority Badge */}
                          <div className="flex w-1/3 text-center">
                            <span
                              className={`py-2 px-auto w-1/2 mt-2 text-center rounded-md text-white ${
                                task.priority === "high"
                                  ? "bg-red-600 border-red-500 border-2"
                                  : task.priority === "mid"
                                  ? "bg-yellow-500 border-yellow-500 border-2"
                                  : "bg-green-500 border-green-500 border-2"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          {/* Completed Section */}
          <div className="bg-black h-auto rounded-xl p-4 shadow-lg flex flex-col">
            <div className="info flex justify-between items-center rounded-xl bg-[#F0BB78] bg-opacity-30 p-4 shadow-md border-white">
              <h1 className="text-white font-bold text-xl">COMPLETED</h1>
            </div>

            <div className="completed mt-4 bg-[#543A14] bg-opacity-20 rounded-xl p-4 flex-grow">
              {completedTasks.length === 0 ? (
                <>
                  <p className="text-center text-gray-500">No tasks completed yet.</p>
                </>
              ) : (
                <ul className="space-y-4">
                  {completedTasks.map((task) => (
                    <li
                      key={task._id}
                      className="text-white flex flex-col p-4 rounded-lg bg-[#1f1f1f] border border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xl">{task.taskTopic}</strong>
                        <div className="text-sm text-gray-300 mb-2">
                          {task.deadline}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {task.taskDescription}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
