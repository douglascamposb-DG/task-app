let filter = "today";
let currentTaskId = null;

function setFilter(f) {
  filter = f;

  // Atualiza título
  document.getElementById("title").textContent =
    f === "today" ? "Hoje" :
    f === "tomorrow" ? "Amanhã" : "Futuro";

  // Atualiza botões do menu
  document.querySelectorAll('.sidebar button').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`btn-${f}`).classList.add('active');

  loadTasks();
}

function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const date = document.getElementById("dateInput").value;
  const time = document.getElementById("timeInput").value;

  if (!text) {
    alert("Por favor, digite o nome da tarefa.");
    return;
  }

  const task = {
    id: Date.now(), // ID único para evitar bugs na edição/exclusão
    text,
    date,
    time,
    done: false,
    notes: ""
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Limpa os campos
  document.getElementById("taskInput").value = "";
  document.getElementById("dateInput").value = "";
  document.getElementById("timeInput").value = "";

  loadTasks();
}

// 🔥 CORREÇÃO DE FUSO HORÁRIO E DATA
function getCategory(task) {
  if (!task.date) return "today"; // Sem data, vai pro Hoje

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Lendo a data string "YYYY-MM-DD" e convertendo corretamente para hora local
  const [year, month, day] = task.date.split('-');
  const taskDate = new Date(year, month - 1, day);
  taskDate.setHours(0, 0, 0, 0);

  const diff = Math.round((taskDate - today) / (1000 * 60 * 60 * 24));

  if (diff <= 0) return "today"; // Passadas e hoje ficam no "Hoje"
  if (diff === 1) return "tomorrow";
  return "future";
}

function loadTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Filtra as tarefas pela aba atual
  let filteredTasks = tasks.filter(task => getCategory(task) === filter);

  // ORDENAÇÃO: Organiza a lista cronologicamente (data e hora)
  filteredTasks.sort((a, b) => {
    let dateA = new Date(`${a.date || '9999-12-31'}T${a.time || '23:59'}`);
    let dateB = new Date(`${b.date || '9999-12-31'}T${b.time || '23:59'}`);
    return dateA - dateB;
  });

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-info">
        <label class="custom-checkbox">
          <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleDone(${task.id})">
          <span class="checkmark"></span>
        </label>
        <div class="task-text">
          <strong>${task.text}</strong>
          <span class="task-datetime">${formatDateDisplay(task.date)} ${task.time ? '- ' + task.time : ""}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn-notes" onclick="openModal(${task.id})">📝 Anotações</button>
        <button class="btn-delete" onclick="deleteTask(${task.id})">🗑 Excluir</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "Sem data definida";
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function toggleDone(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex > -1) {
    tasks[taskIndex].done = !tasks[taskIndex].done;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }
}

function deleteTask(id) {
  if(!confirm("Tem certeza que deseja excluir esta tarefa?")) return;
  
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

// LÓGICA DO MODAL E TEXTO RICO
function openModal(id) {
  currentTaskId = id;
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks.find(t => t.id === id);

  document.getElementById("modalTaskTitle").textContent = `Anotações: ${task.text}`;
  document.getElementById("notesEditor").innerHTML = task.notes || "";
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  currentTaskId = null;
}

function formatText(command) {
  document.execCommand(command, false, null);
  document.getElementById("notesEditor").focus();
}

function saveNotes() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex(t => t.id === currentTaskId);

  if (taskIndex > -1) {
    // Salva o HTML gerado pelo editor
    tasks[taskIndex].notes = document.getElementById("notesEditor").innerHTML;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  closeModal();
}

// Inicia o app
window.onload = loadTasks;
