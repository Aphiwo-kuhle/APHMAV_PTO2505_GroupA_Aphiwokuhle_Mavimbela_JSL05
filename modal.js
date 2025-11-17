import { addTask, updateTask, deleteTask, getTask } from "./storage.js";
import { renderBoard } from "./render.js";

let $modal, $form, $title, $desc, $status, $idHidden;
let $btnCreate, $btnEdit, $btnDelete;

export function initModal() {
  $modal = document.getElementById("modal");
  $form = document.getElementById("taskForm");
  $title = document.getElementById("title");
  $desc = document.getElementById("desc");
  $status = document.getElementById("status");
  $idHidden = document.getElementById("taskId");

  $btnCreate = document.getElementById("primaryAction");
  $btnEdit = document.getElementById("editAction");
  $btnDelete = document.getElementById("deleteAction");

  document.getElementById("closeModal").onclick = hideModal;
  $modal.onclick = (e) => { if (e.target === $modal) hideModal(); };

  $form.onsubmit = (e) => {
    e.preventDefault();

    const id = $idHidden.value.trim();
    const title = $title.value.trim();
    const desc = $desc.value.trim();
    const status = $status.value;

    if (!title) return alert("Title required!");

    if (!id) {
      addTask({ title, desc, status });
    } else {
      updateTask(id, { title, desc, status });
    }

    renderBoard();
    hideModal();
  };

  $btnEdit.onclick = () => setEditMode(true);

  $btnDelete.onclick = () => {
    const id = $idHidden.value;
    deleteTask(id);
    renderBoard();
    hideModal();
  };
}

export function openCreateModal() {
  setEditMode(true);
  $idHidden.value = "";
  $title.value = "";
  $desc.value = "";
  $status.value = "todo";
  $btnCreate.textContent = "Create Task";
  $btnEdit.style.display = "none";
  $btnDelete.style.display = "none";
  showModal();
}

export function openViewModal(taskId) {
  const t = getTask(taskId);
  if (!t) return;

  setEditMode(false);
  $idHidden.value = t.id;
  $title.value = t.title;
  $desc.value = t.desc;
  $status.value = t.status;

  $btnCreate.textContent = "Close";
  $btnEdit.style.display = "inline-block";
  $btnDelete.style.display = "inline-block";

  showModal();
}

function showModal() {
  $modal.classList.remove("hidden");
}

function hideModal() {
  $modal.classList.add("hidden");
}

function setEditMode(enabled) {
  [$title, $desc, $status].forEach(f => {
    f.disabled = !enabled;
  });
  $btnCreate.textContent = enabled ? "Save Task" : "Close";
}
