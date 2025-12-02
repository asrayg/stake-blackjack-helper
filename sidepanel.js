chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "BJ_UPDATE") {
    document.getElementById("move").textContent = msg.move || "Waiting...";
    document.getElementById("playerHand").textContent = msg.playerHand || "-";
    document.getElementById("dealerCard").textContent = msg.dealerCard || "-";
    
    if (msg.stats) {
      document.getElementById("winProbStand").textContent = 
        msg.stats.winProbStand !== undefined ? `${(msg.stats.winProbStand * 100).toFixed(1)}%` : "-";
      document.getElementById("winProbHit").textContent = 
        msg.stats.winProbHit !== undefined ? `${(msg.stats.winProbHit * 100).toFixed(1)}%` : "-";
      document.getElementById("bustProbHit").textContent = 
        msg.stats.bustProbHit !== undefined ? `${(msg.stats.bustProbHit * 100).toFixed(1)}%` : "-";
      document.getElementById("winProbDouble").textContent = 
        msg.stats.winProbDouble !== undefined ? `${(msg.stats.winProbDouble * 100).toFixed(1)}%` : "-";
    }
  }
});

