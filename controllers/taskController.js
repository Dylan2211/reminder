const taskModel = require("../models/taskModel");

async function createTask(req, res) {
  try {
    const task = {
      title: req.body.title,
      description: req.body.description || "",
      dueDate: req.body.dueDate,
      imageUrl: req.file ? `/images/${req.file.filename}` : null,
      isDone: req.body.isDone ? 1 : 0,
    };
    const taskId = await taskModel.createTask(task);

    if (req.body.subtasks && Array.isArray(req.body.subtasks)) {
      for (const sub of req.body.subtasks) {
        await taskModel.createSubtask(taskId, {
          title: sub.title,
          isDone: sub.isDone ? 1 : 0,
        });
      }
    }
    res.status(201).json({ message: "Task created", taskId }); //, subtaskIds
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createTask,
};
