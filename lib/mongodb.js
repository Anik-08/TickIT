import mongoose from "mongoose";

export const connectMongoDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Using existing database connection");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
