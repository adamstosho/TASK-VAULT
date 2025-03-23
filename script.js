const taskInput = document.getElementById("task-input");
const addTask = document.getElementById("add-task");
const lightnessButton = document.getElementById("lightness");
const exportButton = document.getElementById("export-file");
const taskList = document.getElementById("tasks-list");

document.body.classList.add("dark-mode");

document.addEventListener("DOMContentLoaded", loadTasks);

addTask.addEventListener("click", function () {
  let taskNote = taskInput.value.trim();
  if (taskNote !== "") {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let newTask = {
      text: taskNote,
      timestamp: new Date().toISOString(),
      completed: false,
    };

    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    displayTasks();
    taskInput.value = "";
  } else {
    alert("Add a task");
  }
});

function loadTasks() {
  displayTasks();
}

function displayTasks() {
  taskList.innerHTML = "";
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  tasks.forEach(addTaskToList);
}

function addTaskToList(task) {
  let li = document.createElement("li");
  li.innerHTML = `
    <strong>${task.text}</strong> 
    <br>
    <small>${new Date(task.timestamp).toLocaleString()}</small>
  `;

  if (task.completed) {
    li.style.textDecoration = "line-through";
    li.style.color = "gray";
    li.style.backgroundColor = 'white'
  }

  let deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "❌";
  deleteBtn.addEventListener("click", function () {
    deleteTask(task.text);
  });

  let confirmBtn = document.createElement("button");
  confirmBtn.innerHTML = "✔️";
  confirmBtn.addEventListener("click", function () {
    confirmTask(task.text);
  });

  li.appendChild(confirmBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

function deleteTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task.text !== taskText);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

function confirmTask(taskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.map((task) => {
    if (task.text === taskText) {
      task.completed = true;
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

exportButton.addEventListener("click", function () {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let jsonStr = JSON.stringify(tasks, null, 2);
  let blob = new Blob([jsonStr], { type: "application/json" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "tasks.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

lightnessButton.addEventListener("click", function () {
  document.body.classList.toggle("light-mode");
  document.body.classList.toggle("dark-mode");
});
