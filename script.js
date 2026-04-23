let filter = "today";
let currentIndex = null;

function setFilter(f) {
  filter = f;
  document.getElementById("title").textContent =
    f === "today" ? "Hoje" :
    f === "tomorrow" ? "Amanhã" : "Futuro";
  loadTasks();
}

function addTask() {
  const text = document.getElementById("taskInput").value;
  const date = document.getElementById("dateInput").value;
  const time = document.getElementById("timeInput").value;

  if (!text) return;

  const task = {
    text,
    date,
    time,
    done: false,
    notes: ""
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  loadTasks();
}

function getCategory(task) {
  if (!task.date) return "today";

  const today = new Date().toISOString().split("T")[0];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  if (task.date === today) return "today";
  if (task.date === tomorrowStr) return "tomorrow";

  return "future";
}

function loadTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task, index) => {
    if (getCategory(task) !== filter) return;

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${task.text} ${task.time || ""}</span>
      <button onclick="openModal(${index})">Abrir</button>
    `;

    list.appendChild(li);
  });
}

function openModal(index) {
  currentIndex = index;
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  document.getElementById("notes").value = tasks[index].notes || "";
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function saveNotes() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks[currentIndex].notes = document.getElementById("notes").value;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  closeModal();
}

window.onload = loadTasks;
