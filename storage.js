export const STORAGE_KEY = "kanban.tasks";

export function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : "id-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (_) {}
  }

  const seed = [
    { id: uid(), title: "Launch Epic Career 🚀", desc: "Define roadmap.", status: "todo" },
    { id: uid(), title: "Master JavaScript 💛", desc: "Deep JS study.", status: "doing" },
    { id: uid(), title: "Have fun 😺", desc: "Enjoy learning!", status: "done" },
  ];
  saveTasks(seed);
  return seed;
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function addTask(data) {
  const tasks = loadTasks();
  const task = { id: uid(), ...data };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

export function updateTask(id, changes) {
  const tasks = loadTasks();
  const i = tasks.findIndex(t => t.id === id);
  if (i === -1) return;
  tasks[i] = { ...tasks[i], ...changes };
  saveTasks(tasks);
}

export function deleteTask(id) {
  let tasks = loadTasks();
  tasks = tasks.filter(t => t.id !== id);
  saveTasks(tasks);
}

export function getTask(id) {
  return loadTasks().find(t => t.id === id);
}
