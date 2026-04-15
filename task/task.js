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
    const res = await fetch("/api/tasks?isDone=0&sort=asc");
    const tasks = await res.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    let index = 0;
    tasks.forEach((task) => {
      let isDragging = false;
      let startX;
      let startY;
      let startLeft;
      const task = document.createElement("task");
      task.style.top = `${400 + index * 220}px`;
      index++;
      task.className = "task";
      task.innerHTML = `
        <h3>${task.Title}</h3>
        <p>${task.Description}</p>
        ${
          task.ImageUrl
            ? `<img src="${task.ImageUrl}" alt="Task Image" width="100"/>`
            : ""
        }
        `;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.IsDone;
      checkbox.classList.add("task-checkbox");
      task.appendChild(checkbox);

      taskList.appendChild(task);
      task.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startLeft = parseInt(window.getComputedStyle(task).left, 10);
        task.style.transition = "none";
      });
      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        task.style.left = startLeft + dx + "px";
      });
      document.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          task.style.transition = "transform 0.1s";
        }
      });
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}
