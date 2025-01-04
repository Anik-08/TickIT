// app/api/tasks/completed/route.js
import { connectMongoDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { taskIds } = await req.json(); // Get task IDs from request

    await connectMongoDB();

    const completedTasks = await Task.find({
      _id: { $in: taskIds },
    });

    return NextResponse.json({ tasks: completedTasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    return NextResponse.json({ message: "An error occurred." }, { status: 500 });
  }
}
