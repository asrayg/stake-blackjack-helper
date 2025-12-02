let box;

export function createOverlay() {
  box = document.createElement("div");
  box.style.position = "fixed";
  box.style.top = "20px";
  box.style.left = "20px";
  box.style.padding = "10px 15px";
  box.style.background = "rgba(0,0,0,0.7)";
  box.style.color = "lime";
  box.style.fontSize = "22px";
  box.style.borderRadius = "8px";
  box.style.zIndex = "999999999";
  box.innerText = "Waiting...";
  document.body.appendChild(box);
}

export function updateOverlay(move) {
  box.innerText = "Move: " + move;
}

