import { connectMongoDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

// POST Request to create a new task
export async function POST(req) {
  try {
    const { taskTopic, taskDescription, deadline, priority, user } = await req.json();

    // Ensure the task data and user ID are provided
    if (!taskTopic || !taskDescription || !deadline || !priority || !user) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    await connectMongoDB();

    const newTask = await Task.create({
      taskTopic,
      taskDescription,
      deadline,
      priority,
      user, 
    });
    
    return NextResponse.json({ message: "Task added.", task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ message: "An error occurred while adding the task." }, { status: 500 });
  }
}

// GET Request to fetch tasks (filtering by user)
export async function GET(req) {
  try {
    await connectMongoDB();
    const userId = req.headers.get('user');  

    if (!userId) {
      return NextResponse.json({ message: "User ID not provided." }, { status: 400 });
    }
    // Fetch tasks associated with the specific user
    const tasks = await Task.find({ user: userId });  
    // console.log("Tasks associated with user: ", userId ," are:",tasks);
    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ message: "No tasks found." }, { status: 404 });
    }

    // console.log("Tasks fetched:", tasks);
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ message: "An error occurred while fetching tasks." }, { status: 500 });
  }
}
