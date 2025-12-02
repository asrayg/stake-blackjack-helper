chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "BJ_MOVE") {
    document.getElementById("move").textContent = msg.move;
  }
});

