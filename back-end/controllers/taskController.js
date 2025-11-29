// controllers/taskController.js
const Task = require("../models/Task.js");

// Create task
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    console.error("CreateTask error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tasks for logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    console.error("GetTasks error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status } = req.body;

    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Ensure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();

    res.json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    console.error("UpdateTask error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("DeleteTask error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
