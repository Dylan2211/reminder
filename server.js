console.log("require type:", typeof require);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static(path.join(__dirname, "images")));

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
