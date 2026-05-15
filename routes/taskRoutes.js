const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const path = require("path");

// Image handling
const multer = require("multer");
const upload = multer({ storage: storage });

router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTask);
router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
