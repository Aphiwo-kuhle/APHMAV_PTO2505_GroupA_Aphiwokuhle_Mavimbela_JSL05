import { initModal } from "./modal.js";
import { initEvents } from "./events.js";
import { renderBoard } from "./render.js";

document.addEventListener("DOMContentLoaded", () => {
  initModal();
  initEvents();
  renderBoard();
});
