initTaskDrag();
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
// #region Task Loading
function initTaskDrag() {
  interact(".task").draggable({
    listeners: {
      start(event) {},
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.dataset.x) || 0) + event.dx;
        const y = (parseFloat(target.dataset.y) || 0) + event.dy;
        event.target.style.transform = `translate(${x}px, ${y}px)`;
        target.dataset.x = x;
        target.dataset.y = y;
      },
    },
  });
}

async function loadTasks() {
  try {
    const res = await fetch("/api/tasks?isDone=0");
    const tasks = await res.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    let index = 0;
    tasks.forEach((task) => {
      console.log("There is a task created!");
      const taskElement = document.createElement("task");
      // taskElement.style.top = `${400 + index * 220}px`;
      index++;
      taskElement.className = "task";
      taskElement.innerHTML = `
        <h3>${task.Title}</h3>
        <p>${task.Description}</p>
        `;
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.IsDone;
      checkbox.classList.add("task-checkbox");
      taskElement.appendChild(checkbox);

      taskList.appendChild(taskElement);
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

function onTaskClick(taskId) {}

// #endregion
