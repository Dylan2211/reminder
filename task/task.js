loadTasks();

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("image", document.getElementById("image").files[0]);

  const res = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    alert("Task added successfully!");
    loadTasks();
  } else {
    alert("Error adding task");
  }
});

async function loadTasks() {
  try {
    const res = await fetch("/api/tasks?isDone=0");
    const tasks = await res.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    let index = 0;
    tasks.forEach((task) => {
      let isDragging = false;
      let startX;
      let startY;
      let startLeft;
      const taskElement = document.createElement("task");
      taskElement.style.top = `${400 + index * 220}px`;
      index++;
      taskElement.className = "task";
      taskElement.innerHTML = `
        <h3>${task.Title}</h3>
        <p>${task.Description}</p>
        `;
      taskElement.style.backgroundImage = task.ImageUrl
        ? `url("task.{ImageUrl}")`
        : "none";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.IsDone;
      checkbox.classList.add("task-checkbox");
      taskElement.appendChild(checkbox);

      taskList.appendChild(taskElement);
      taskElement.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startLeft = parseInt(window.getComputedStyle(taskElement).left, 10);
        taskElement.style.transition = "none";
      });
      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        taskElement.style.left = startLeft + dx + "px";
      });
      document.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          taskElement.style.transition = "transform 0.1s";
        }
      });
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}
