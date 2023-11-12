import { getId } from "./helper.js";

const dropBox = getId("dropBox");

function openDropBox() {
  dropBox.style.transform = "translate(0, 0)";
  dropBox.dataset.open = "open";
}

function closeDropBox() {
  dropBox.style.transform = "translate(0, -100%)";
  dropBox.dataset.open = "closed";
}

function dropBoxControl() {
  const status = dropBox.dataset.open;
  if (status == "closed") {
    openDropBox();
  }
  if (status == "open") {
    closeDropBox();
  }
}

export { dropBoxControl };
