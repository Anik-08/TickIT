import { connectMongoDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

// PATCH method to mark the task as completed
export async function PATCH(req, { params }) {
  const { taskId } = params; // Access taskId from URL params
  try {
    await connectMongoDB(); // Ensure the DB is connected

    const task = await Task.findById(taskId); // Fetch task by ID

    if (!task) {
      return NextResponse.json({ message: "Task not found." }, { status: 404 });
    }

    // Mark task as completed
    task.completed = true;
    await task.save(); // Save the updated task

    return NextResponse.json({ message: "Task marked as done.", task }, { status: 200 });
  } catch (error) {
    console.error("Error marking task as done:", error);
    return NextResponse.json({ message: "An error occurred while marking the task." }, { status: 500 });
  }
}

// Optionally, you can add a POST method if you're handling a different route for marking tasks completed.
