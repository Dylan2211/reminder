loadTasks();

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("dueDate", document.getElementById("dueDate").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("image", document.getElementById("image").files[0]);

  const res = await fetch("http://localhost:3000/api/tasks", {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    alert("Task added successfully!");
    // Optionally reload or update taskList dynamically
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
      let startLeft;
      const div = document.createElement("div");
      div.style.top = `${400 + index * 220}px`;
      index++;
      div.className = "task";
      div.innerHTML = `
        <h3>${task.Title}</h3>
        <p>${task.Description}</p>
        <small>Due: ${new Date(task.DueDate).toLocaleDateString()}</small>
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
      div.appendChild(checkbox);

      taskList.appendChild(div);
      div.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startLeft = parseInt(window.getComputedStyle(div).left, 10);
        div.style.transition = "none";
      });
      document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        div.style.left = startLeft + dx + "px";
      });
      document.addEventListener("mouseup", () => {
        if (isDragging) {
          isDragging = false;
          div.style.transition = "transform 0.1s";
        }
      });
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}
