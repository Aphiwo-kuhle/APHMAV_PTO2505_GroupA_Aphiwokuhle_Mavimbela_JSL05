import { loadTasks } from "./storage.js";

export function renderBoard() {
  const tasks = loadTasks();

  const todo = tasks.filter(t => t.status === "todo");
  const doing = tasks.filter(t => t.status === "doing");
  const done = tasks.filter(t => t.status === "done");

  paintList("todoList", todo);
  paintList("doingList", doing);
  paintList("doneList", done);

  document.getElementById("todoTitle").textContent = `TODO (${todo.length})`;
  document.getElementById("doingTitle").textContent = `DOING (${doing.length})`;
  document.getElementById("doneTitle").textContent = `DONE (${done.length})`;
}

function paintList(id, tasks) {
  const list = document.getElementById(id);
  list.innerHTML = "";
  tasks.forEach(t => list.appendChild(taskCard(t)));
}

function taskCard(task) {
  const el = document.createElement("article");
  el.className = "task";
  el.dataset.id = task.id;

  el.innerHTML = `
    <h3 class="task-title">${task.title}</h3>
    <p class="task-desc">${task.desc || "No description"}</p>
  `;
  return el;
}
