let currentDay = "today";

function setDay(day) {
  currentDay = day;
  document.getElementById("title").textContent =
    day === "today" ? "Hoje" : "Amanhã";
  loadTasks();
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value;

  const dateField = document.getElementById("dateInput");
  const dateInput = dateField ? dateField.value : "";

  if (text === "") return;

  let day = "today";

  if (dateInput) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(dateInput);
    selected.setHours(0, 0, 0, 0);

    const diff = Math.round((selected - today) / (1000 * 60 * 60 * 24));

    if (diff === 0) day = "today";
    else if (diff === 1) day = "tomorrow";
    else day = "future";
  }

  const task = {
    text: text,
    day: day,
    done: false,
    date: dateInput
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  input.value = "";
  if (dateField) dateField.value = "";

  loadTasks();
}

function loadTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task, index) => {
    if (task.day !== currentDay) return;

    const li = document.createElement("li");

    const left = document.createElement("div");
    left.className = "left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;

    const span = document.createElement("span");
    span.textContent = task.text;

    if (task.done) {
      span.style.textDecoration = "line-through";
    }

    checkbox.onclick = () => toggleTask(index);

    left.appendChild(checkbox);
    left.appendChild(span);

    const del = document.createElement("button");
    del.textContent = "X";
    del.className = "delete";
    del.onclick = () => deleteTask(index);

    li.appendChild(left);
    li.appendChild(del);

    list.appendChild(li);
  });
}

function toggleTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks[index].done = !tasks[index].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

window.onload = loadTasks;
