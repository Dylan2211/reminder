document.getElementById("taskForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("title").value);
  formData.append("dueDate", document.getElementById("dueDate").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("image", document.getElementById("image").files[0]);

  const res = await fetch("http://localhost:3000/tasks", {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    alert("Task added successfully!");
    // Optionally reload or update taskList dynamically
  } else {
    alert("Error adding task");
  }
});
