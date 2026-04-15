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
      const task_object = document.createElement("task");
      task_object.style.top = `${400 + index * 220}px`;
      index++;
      task_object.className = "task";
      task_object.innerHTML = `
        <h3>${task.Title}</h3>
        <p>${task.Description}</p>
        `;
      task_object.style.backgroundImage = task.ImageUrl;
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.IsDone;
      checkbox.classList.add("task-checkbox");
      task_object.appendChild(checkbox);

      taskList.appendChild(task_object);
      task_object.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startLeft = parseInt(window.getComputedStyle(task_object).left, 10);
        task_object.style.transition = "none";
      });
      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        task_object.style.left = startLeft + dx + "px";
      });
      document.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          task_object.style.transition = "transform 0.1s";
        }
      });
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}
