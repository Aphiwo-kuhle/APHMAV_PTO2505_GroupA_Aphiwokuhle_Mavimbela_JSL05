import { openCreateModal, openViewModal } from "./modal.js";

export function initEvents() {
  document.getElementById("addTaskTopRight").onclick = openCreateModal;
  document.getElementById("addTaskMobile").onclick = openCreateModal;
  document.getElementById("addTaskFab").onclick = openCreateModal;

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".task");
    if (card) openViewModal(card.dataset.id);
  });
}
