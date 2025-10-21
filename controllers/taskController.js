const taskModel = require("../models/taskModel");

async function createTask(req, res) {
  try {
    if (!req.body.title) {
      return res.json({ error: "No title!" });
    }
    if (!req.body.dueDate) {
      return res.json({ error: "No dueDate!" });
    }
    const task = {
      title: req.body.title,
      description: req.body.description || "",
      dueDate: req.body.dueDate,
      imageUrl: req.file ? `/images/${req.file.filename}` : null,
      isDone: req.body.isDone ? 1 : 0,
    };
    const taskId = await taskModel.createTask(task);

    res.status(201).json({ message: "Task created", taskId }); //, subtaskIds
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createSubtask(req, res) {
  try {
    const taskId = parseInt(req.params.id);
    if (!req.body.title) {
      return res.json({ error: "No title!" });
    }
    const subtask = {
      title: req.body.title,
      isDone: req.body.isDone ? 1 : 0,
    };
    const subtaskId = await taskModel.createSubtask({ taskId, subtask });

    res.status(201).json({ message: "Subtask created", subtaskId });
  } catch (error) {
    console.error("Error creating subtask:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllTasks(req, res) {
  try {
    const { sort, isDone } = req.query;
    if (isDone !== "1" && isDone !== "0") {
      return res.status(400).json({ message: "Invalid isDone value" });
    }
    const sortDate = sort === "desc" ? "DESC" : "ASC";
    const tasks = await taskModel.getAllTasks({ sortDate, isDone });
    res.json(tasks);
  } catch (error) {
    console.error(`Error getting tasks:${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getTaskById(req, res) {
  try {
    const taskId = parseInt(req.params.id);
    const task = await taskModel.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error(`Error getting task by id: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateTask(req, res) {
  try {
    const taskId = parseInt(req.params.id);
    const taskData = {
      title: req.body.title,
      description: req.body.description || "",
      dueDate: req.body.dueDate,
      imageUrl: req.file ? `/images/${req.file.filename}` : null,
      isDone: req.body.isDone ? 1 : 0,
    };

    const { updated } = await taskModel.updateTask({ taskId, taskData });

    if (!updated) {
      return res.json({ error: "Task not found" });
    }

    res.json({ message: "Task updated successfully", taskId });
  } catch (error) {
    console.error("Error in updateTask:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteTask(req, res) {
  try {
    const taskId = parseInt(req.params.id);
    const deleted = await taskModel.deleteTask(taskId);
    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(`Error deleting task: ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createTask,
  createSubtask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
