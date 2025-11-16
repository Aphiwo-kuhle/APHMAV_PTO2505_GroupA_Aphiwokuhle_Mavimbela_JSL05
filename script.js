/**
 * JSL05 Kanban - script.js
 * Combined: localStorage persistence, modal management, rendering and button wiring.
 */

 /** Local storage key */
const STORAGE_KEY = 'kanban.tasks';

/** Utility: create uid */
function uid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'id-' + Date.now().toString(36) + Math.random().toString(36).slice(2,9);
}

/**
 * Load tasks from localStorage. If none, seed initial tasks and save.
 * @returns {Array<Object>} list of tasks
 */
function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (err) { console.warn('Failed parse tasks', err); }
  }
  // seed data
  const seed = [
    { id: uid(), title: 'Launch Epic Career 🚀', desc: 'Define vision, targets, and roadmap.', status: 'todo' },
    { id: uid(), title: 'Conquer React 🧩', desc: 'Components, hooks, state management.', status: 'todo' },
    { id: uid(), title: 'Master JavaScript 💛', desc: 'Get comfortable with the fundamentals', status: 'doing' },
    { id: uid(), title: 'Have fun 😺', desc: 'Enjoy learning', status: 'done' }
  ];
  saveTasks(seed);
  return seed;
}

/**
 * Save tasks array to localStorage
 * @param {Array<Object>} tasks
 */
function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Add a new task to storage
 * @param {Object} partial {title, desc, status}
 * @returns {Object} created task
 */
function addTask(partial) {
  const tasks = loadTasks();
  const task = { id: uid(), ...partial };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

/**
 * Update a task by id
 * @param {string} id
 * @param {Object} patch
 */
function updateTask(id, patch) {
  const tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...patch };
  saveTasks(tasks);
  return tasks[idx];
}

/**
 * Get single task by id
 * @param {string} id
 * @returns {Object|null}
 */
function getTask(id) {
  return loadTasks().find(t => t.id === id);
}

/* ---------- Rendering ---------- */

/**
 * Renders full board
 */
function renderBoard() {
  const tasks = loadTasks();
  const groups = {
    todo: tasks.filter(t => t.status === 'todo'),
    doing: tasks.filter(t => t.status === 'doing'),
    done: tasks.filter(t => t.status === 'done'),
  };

  paintList('todoList', groups.todo);
  paintList('doingList', groups.doing);
  paintList('doneList', groups.done);

  setTitle('todoTitle', 'TODO', groups.todo.length);
  setTitle('doingTitle', 'DOING', groups.doing.length);
  setTitle('doneTitle', 'DONE', groups.done.length);
}

/**
 * Set column title and count
 * @param {string} id
 * @param {string} label
 * @param {number} n
 */
function setTitle(id, label, n) {
  const el = document.getElementById(id);
  if (el) el.textContent = `${label} (${n})`;
}

/**
 * Fill a list container with tasks
 * @param {string} listId
 * @param {Array<Object>} tasks
 */
function paintList(listId, tasks) {
  const list = document.getElementById(listId);
  if (!list) return;
  list.innerHTML = '';
  tasks.forEach(t => list.appendChild(taskCard(t)));
}

/**
 * Create DOM element for a task card
 * @param {Object} task
 * @returns {HTMLElement}
 */
function taskCard(task) {
  const el = document.createElement('article');
  el.className = 'task';
  el.dataset.taskId = task.id;

  const h = document.createElement('h3');
  h.className = 'task-title';
  h.textContent = task.title;

  const p = document.createElement('p');
  p.className = 'task-desc';
  p.textContent = task.desc || 'No description';

  el.append(h, p);
  return el;
}

/* ---------- Modal handling ---------- */
let $modal, $close, $form, $modalTitle, $submitBtn, $idInput, $titleInput, $descInput, $statusSel;

function initModalElements() {
  $modal = document.getElementById('modal');
  $close = document.getElementById('closeModal');
  $form = document.getElementById('taskForm');
  $modalTitle = document.getElementById('modalTitle');
  $submitBtn = $form.querySelector('button.primary');
  $idInput = document.getElementById('taskId');
  $titleInput = document.getElementById('title');
  $descInput = document.getElementById('desc');
  $statusSel = document.getElementById('status');

  // close button
  if ($close) $close.addEventListener('click', hideModal);
  // click outside modal to close
  $modal.addEventListener('click', (e)=> { if (e.target === $modal) hideModal(); });

  // form submit handles create (or close when readonly)
  $form.addEventListener('submit', (e)=> {
    e.preventDefault();
    if ($form.classList.contains('readonly')) { hideModal(); return; }

    const title = $titleInput.value.trim();
    const desc = $descInput.value.trim();
    const status = $statusSel.value;

    if (!title) {
      $titleInput.focus();
      return;
    }

    addTask({ title, desc, status });
    renderBoard();
    hideModal();
  });
}

function openCreateModal() {
  $form.classList.remove('readonly');
  $modalTitle.textContent = 'Add New Task';
  $submitBtn.textContent = 'Create Task';
  $idInput.value = '';
  $titleInput.value = '';
  $descInput.value = '';
  $statusSel.value = 'todo';
  showModal();
}

function openViewModal(taskId) {
  const task = getTask(taskId);
  if (!task) return;
  $form.classList.add('readonly');
  $modalTitle.textContent = 'Task Details';
  $submitBtn.textContent = 'Close';
  $idInput.value = task.id;
  $titleInput.value = task.title;
  $descInput.value = task.desc || '';
  $statusSel.value = task.status;
  showModal();
}

function showModal() {
  $modal.classList.remove('hidden');
  $modal.setAttribute('aria-hidden', 'false');
  // small delay so focus will work when modal is visible
  setTimeout(() => $titleInput.focus(), 10);
}

function hideModal() {
  $modal.classList.add('hidden');
  $modal.setAttribute('aria-hidden', 'true');
}

/* ---------- App Init & Event wiring ---------- */
function init() {
  initModalElements();
  // ensure local storage is initialized then render
  loadTasks();
  renderBoard();

  // buttons (desktop & mobile)
  const addBtn = document.getElementById('addTaskBtn');         // left near title (desktop)
  const addTopRight = document.getElementById('addTaskTopRight'); // top-right rectangle (desktop)
  const addMobile = document.getElementById('addTaskMobile');   // circle inside header (mobile)
  const addFab = document.getElementById('addTaskFab');         // optional fab (hidden by CSS)

  if (addBtn) addBtn.addEventListener('click', openCreateModal);
  if (addTopRight) addTopRight.addEventListener('click', openCreateModal);
  if (addMobile) addMobile.addEventListener('click', openCreateModal);
  if (addFab) addFab.addEventListener('click', openCreateModal);

  // open task details when clicking a task (delegation)
  document.addEventListener('click', (e) => {
    const el = e.target.closest('.task');
    if (el && el.dataset.taskId) openViewModal(el.dataset.taskId);
  });
}

// start
document.addEventListener('DOMContentLoaded', init);
