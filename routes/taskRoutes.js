const express = require("express");
const multer = require("multer");
const router = express.Router();
const taskController = require("../controllers/taskController");

const upload = multer({ dest: "images/" });
router.get("/", taskController.getAllTasks);
router.post("/", upload.single("image"), taskController.createTask);
router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
