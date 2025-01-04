import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { email } = await req.json();

    // Check if the email is already in the database
    const existingUser = await User.findOne({ email });

    // If user exists, return an appropriate response
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered." }, { status: 400 });
    }

    // If user doesn't exist, proceed with the registration or response
    return NextResponse.json({ message: "Email is available." });

  } catch (error) {
    console.log(error);
    // Return an error response if something goes wrong
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
