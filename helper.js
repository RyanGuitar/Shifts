function getId(id) {
  return document.getElementById(id);
}

function addClick(id, fn) {
  getId(id).addEventListener("click", fn);
}

function addToId(id, el) {
  getId(id).innerHTML = el;
}

function toText(object) {
  return JSON.stringify(object);
}

export { addClick, getId, addToId, toText };
