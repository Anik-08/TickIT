import mongoose from "mongoose";

// Cache the connections to avoid multiple connections being created
let userDbConnection = null;
let tasksDbConnection = null;

export const connectMongoDB = async () => {
  try {
    // Connect to the user database if not already connected
    if (mongoose.connections[0].readyState) {
      console.log("Using existing connection to the first database (users)");
      userDbConnection = mongoose.connections[0];
    } else {
      // Connect to the first MongoDB database (users)
      userDbConnection = await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to the first MongoDB database (users)");
    }

    // Connect to the second MongoDB database (tasks) with a separate connection
    if (!tasksDbConnection?.readyState) {
      tasksDbConnection = mongoose.createConnection(process.env.MONGODB_URI_TASKS);
      console.log("Connected to the second MongoDB database (tasks)");
    }
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};
