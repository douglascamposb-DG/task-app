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
  const dateInput = document.getElementById("dateInput").value;

  if (text === "") return;

  let day = "today";

  if (dateInput) {
    const today = new Date();
    const selected = new Date(dateInput);

    const diff = Math.ceil((selected - today) / (1000 * 60 * 60 * 24));

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
  document.getElementById("dateInput").value = "";

  loadTasks();
}
  const text = document.getElementById("taskInput").value;
  if (text === "") return;

  const task = {
    text: text,
    day: currentDay,
    done: false
  };

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  document.getElementById("taskInput").value = "";
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

    if (task.done) span.style.textDecoration = "line-through";

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
