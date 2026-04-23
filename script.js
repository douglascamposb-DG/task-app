let filter = "today";
let currentTaskId = null;

function setFilter(f) {
  filter = f;

  const titles = {
    "all": "Visão Geral",
    "today": "Hoje",
    "tomorrow": "Amanhã",
    "future": "Futuro"
  };
  
  document.getElementById("title").textContent = titles[f];

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
    id: Date.now(),
    text,
    date,
    time,
    done: false,
    notes: "",
    priority: false // Nova propriedade da estrelinha
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task); // Adiciona no final da lista
  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskInput").value = "";
  document.getElementById("dateInput").value = "";
  document.getElementById("timeInput").value = "";

  loadTasks();
}

function getCategory(task) {
  if (!task.date) return "today"; 

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = task.date.split('-');
  const taskDate = new Date(year, month - 1, day);
  taskDate.setHours(0, 0, 0, 0);

  const diff = Math.round((taskDate - today) / (1000 * 60 * 60 * 24));

  if (diff <= 0) return "today"; 
  if (diff === 1) return "tomorrow";
  return "future";
}

function loadTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Filtra as tarefas dependendo da aba (se for 'all', não filtra nada)
  let filteredTasks = tasks.filter(task => filter === "all" || getCategory(task) === filter);

  // Removi a ordenação de data. Agora ele obedece a ordem do array (que você vai arrastar e mudar)
  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.setAttribute("draggable", "true");
    li.setAttribute("data-id", task.id);
    
    // Eventos de arrastar e soltar (Drag and Drop)
    li.ondragstart = (e) => dragStart(e, task.id);
    li.ondragover = dragOver;
    li.ondragleave = dragLeave;
    li.ondrop = (e) => drop(e, task.id);
    li.ondragend = dragEnd;

    if (task.done) li.classList.add("completed");
    if (task.priority) li.classList.add("is-priority");

    li.innerHTML = `
      <div class="task-info">
        <span class="drag-handle" title="Segure e arraste">☰</span>
        <span class="star ${task.priority ? 'active' : ''}" onclick="togglePriority(${task.id})" title="Marcar Prioridade">★</span>
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
        <button class="btn-notes" onclick="openModal(${task.id})">📝 Editar</button>
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

// --- FUNÇÕES DE ARRASTAR E SOLTAR (DRAG AND DROP) ---
function dragStart(e, id) {
  e.dataTransfer.setData('text/plain', id);
  setTimeout(() => e.target.classList.add('dragging'), 0);
}

function dragOver(e) {
  e.preventDefault();
  const target = e.target.closest('li');
  if (target && !target.classList.contains('dragging')) {
    target.classList.add('drag-over');
  }
}

function dragLeave(e) {
  const target = e.target.closest('li');
  if (target) target.classList.remove('drag-over');
}

function drop(e, targetId) {
  e.preventDefault();
  const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
  if (draggedId === targetId) return;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const draggedIndex = tasks.findIndex(t => t.id === draggedId);
  const targetIndex = tasks.findIndex(t => t.id === targetId);

  if (draggedIndex > -1 && targetIndex > -1) {
    // Remove o item arrastado da posição antiga e insere na nova
    const [draggedItem] = tasks.splice(draggedIndex, 1);
    tasks.splice(targetIndex, 0, draggedItem);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }
}

function dragEnd(e) {
  e.target.classList.remove('dragging');
  document.querySelectorAll('li').forEach(li => li.classList.remove('drag-over'));
}
// --------------------------------------------------

function toggleDone(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex > -1) {
    tasks[taskIndex].done = !tasks[taskIndex].done;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }
}

function togglePriority(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex > -1) {
    tasks[taskIndex].priority = !tasks[taskIndex].priority;
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

function openModal(id) {
  currentTaskId = id;
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks.find(t => t.id === id);

  document.getElementById("modalTaskTitle").textContent = `Editando: ${task.text}`;
  document.getElementById("editDate").value = task.date || "";
  document.getElementById("editTime").value = task.time || "";
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

// Renomeado para salvar detalhes, já que agora salva anotação, data e hora
function saveTaskDetails() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskIndex = tasks.findIndex(t => t.id === currentTaskId);

  if (taskIndex > -1) {
    tasks[taskIndex].date = document.getElementById("editDate").value;
    tasks[taskIndex].time = document.getElementById("editTime").value;
    tasks[taskIndex].notes = document.getElementById("notesEditor").innerHTML;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  closeModal();
  loadTasks(); // Atualiza a lista na tela, caso a nova data mude a tarefa de aba
}

window.onload = loadTasks;
