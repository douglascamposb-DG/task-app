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

  document.getElementById("taskInput").value = "";
  document.getElementById("dateInput").value = "";
  document.getElementById("timeInput").value = "";

  loadTasks();
}

// 🔥 FUNÇÃO CORRIGIDA (a mais importante)
function getCategory(task) {
  if (!task.date) return "today";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskDate = new Date(task.date);
  taskDate.setHours(0, 0, 0, 0);

  const diff = Math.round((taskDate - today) / (1000 * 60 * 60 * 24));

  if (diff <= 0) return "today";
  if (diff === 1) return "tomorrow";
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
      <div>
        <strong>${task.text}</strong><br>
        ${task.date || ""} ${task.time || ""}
      </div>
      <div>
        <button onclick="openModal(${index})">Abrir</button>
        <button onclick="deleteTask(${index})">X</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function openModal(index) {
  currentIndex = index;

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  document.getElementById("notes").value =
    tasks[index].notes || "";

  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function saveNotes() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks[currentIndex].notes =
    document.getElementById("notes").value;

  localStorage.setItem("tasks", JSON.stringify(tasks));

  closeModal();
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.splice(index, 1);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  loadTasks();
}

window.onload = loadTasks;
