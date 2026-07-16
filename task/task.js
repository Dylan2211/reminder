initTaskDrag();
loadTasks();

document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("description", document.getElementById("description").value);
  // formData.append("image", document.getElementById("image").files[0]);

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
      end(event) {
        const target = event.target;
        const id = target.dataset.id;
        if (!id) return;
        const x = Number(target.dataset.x) || 0;
        const y = Number(target.dataset.y) || 0;
        fetch(`/api/tasks/${id}/position`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ xCoordinate: x, yCoordinate: y }),
        }).catch((err) => console.error("Error updating task position:", err));
      },
    },
  });
}

async function loadTasks() {
  try {
    const res = await fetch("/api/tasks?isDone=0");
    const tasks = await res.json();
    let index = 0;
    if (!Array.isArray(tasks)) {
      console.log("Expected an array of tasks but got:", tasks);
      console.error("Expected an array of tasks but got:", tasks);
      return;
    }
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
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
      taskElement.dataset.id = task.TaskId;
      taskElement.addEventListener("click", () => onTaskClick(task.TaskId));
      taskList.appendChild(taskElement);
    });
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

function onTaskClick(taskId) {}

// #endregion
