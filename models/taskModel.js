const dbConfig = require("../dbConfig");

async function createTask(task) {
  const { title, description, dueDate, imageUrl, isDone } = task;
  const pool = await dbConfig;
  const result = await pool
    .request()
    .input("title", sql.NVarChar, title)
    .input("description", sql.NVarChar, description)
    .input("dueDate", sql.DateTime, dueDate)
    .input("imageUrl", sql.NVarChar, imageUrl)
    .input("isDone", sql.Bit, isDone)
    .query(`INSERT INTO Tasks (Title, Description, DueDate, ImageUrl, IsDone)
            OUTPUT INSERTED.id
            VALUES (@title, @description, @dueDate, @imageUrl, @isDone)`);
  return result.recordset[0].id;
}

async function createSubtask(taskId, subtask) {
  const { title, isDone } = subtask;
  const pool = await dbConfig;
  const result = await pool
    .request()
    .input("taskId", sql.Int, taskId)
    .input("title", sql.NVarChar, title)
    .input("isDone", sql.Bit, isDone)
    .query(`INSERT INTO Subtasks (TaskId, Title, IsDone)
            OUTPUT INSERTED.id
            VALUES (@taskId, @title, @isDone)`);
  return result.recordset[0].id;
}

module.exports = {
  createTask,
  createSubtask,
};
