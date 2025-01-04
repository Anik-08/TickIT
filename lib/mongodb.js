import mongoose from "mongoose";

let userDbConnection = null;
let tasksDbConnection = null;

export const connectMongoDB = async () => {
  try {
    if (!userDbConnection) {
      userDbConnection = await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB (authapp)!");
    }

    if (!tasksDbConnection?.readyState) {
      tasksDbConnection = mongoose.createConnection(process.env.MONGODB_URI_TASKS);
      console.log("Connected to MongoDB (tasks)!");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
