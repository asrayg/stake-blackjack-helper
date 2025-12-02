import { readCards } from "./detector.js";
import { getMove, calculateProbabilities } from "./strategy.js";
import { createOverlay, updateOverlay } from "./overlay.js";

createOverlay();

function formatHand(cards) {
  return cards.map(c => c === "A" ? "A" : c).join(", ");
}

function loop() {
  try {
    const { player, dealer } = readCards();

    if (!player.length || !dealer) {
      updateOverlay("Waiting...");
      chrome.runtime.sendMessage({ 
        type: "BJ_UPDATE", 
        move: "Waiting for cards...",
        playerHand: "-",
        dealerCard: "-"
      });
      requestAnimationFrame(loop);
      return;
    }

    const move = getMove(player, dealer);
    const stats = calculateProbabilities(player, dealer);

    updateOverlay(move);

    chrome.runtime.sendMessage({ 
      type: "BJ_UPDATE", 
      move,
      playerHand: formatHand(player),
      dealerCard: dealer === "A" ? "A" : dealer,
      stats
    });
  } catch (e) {
    console.error("Error in loop:", e);
  }

  requestAnimationFrame(loop);
}

loop();

