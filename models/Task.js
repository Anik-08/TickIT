import mongoose from "mongoose";
import User from "./user.js";  

const TaskSchema = new mongoose.Schema({
  taskTopic: { type: String, required: true },
  taskDescription: { type: String, required: true },
  deadline: { type: String, required: true },
  priority: {
    type: String,
    enum: ['low', 'mid', 'high'],
    default: 'low'
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
},
  {collection: 'tasks'},
);

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
