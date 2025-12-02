// Stake Blackjack Helper - Console Script
// Paste this entire script into the browser console on the Stake blackjack page

(function() {
  'use strict';
  
  console.log("[BJ Helper] Console script loaded!");
  
  // Card detection
  function readCards() {
    const player = [];
    const dealer = [];
    
    const dealerContainer = document.querySelector('[data-testid="dealer"]');
    const playerContainer = document.querySelector('[data-testid="player"]');
    
    console.log("[BJ Helper] Dealer container:", !!dealerContainer);
    console.log("[BJ Helper] Player container:", !!playerContainer);
    
    const parseCardValue = (spanElement) => {
      if (!spanElement) return null;
      const text = spanElement.textContent.trim();
      
      if (text === 'A' || text === 'a') return "A";
      if (text === 'K' || text === 'k') return 10;
      if (text === 'Q' || text === 'q') return 10;
      if (text === 'J' || text === 'j') return 10;
      
      const num = parseInt(text);
      if (!isNaN(num) && num >= 2 && num <= 10) return num;
      return null;
    };
    
    // Get dealer cards - only first visible card (up card)
    if (dealerContainer) {
      const dealerCards = dealerContainer.querySelectorAll('[data-testid^="card-"]');
      console.log("[BJ Helper] Found", dealerCards.length, "dealer cards");
      
      for (const card of dealerCards) {
        const faceContent = card.querySelector('.face-content');
        if (faceContent) {
          const span = faceContent.querySelector('span');
          if (span && span.textContent.trim()) {
            const value = parseCardValue(span);
            if (value !== null) {
              dealer.push(value);
              console.log("[BJ Helper] Found dealer card:", value);
              break;
            }
          }
        }
      }
    }
    
    // Get player cards
    if (playerContainer) {
      const playerCards = playerContainer.querySelectorAll('[data-testid^="card-"]');
      console.log("[BJ Helper] Found", playerCards.length, "player cards");
      
      for (const card of playerCards) {
        const faceContent = card.querySelector('.face-content');
        if (faceContent) {
          const span = faceContent.querySelector('span');
          if (span && span.textContent.trim()) {
            const value = parseCardValue(span);
            if (value !== null) {
              player.push(value);
              console.log("[BJ Helper] Found player card:", value);
            }
          }
        }
      }
    }
    
    console.log("[BJ Helper] Final results:", { player, dealer: dealer.length > 0 ? dealer[0] : null });
    return { player, dealer: dealer.length > 0 ? dealer[0] : null };
  }
  
  // Strategy tables - converted from Python dictionary format
  const hardStrategy = {
    8:  {2:"H",3:"H",4:"H",5:"H",6:"H",7:"H",8:"H",9:"H",10:"H","A":"H"},
    9:  {2:"H",3:"D/H",4:"D/H",5:"D/H",6:"D/H",7:"H",8:"H",9:"H",10:"H","A":"H"},
    10: {2:"D/H",3:"D/H",4:"D/H",5:"D/H",6:"D/H",7:"D/H",8:"D/H",9:"D/H",10:"H","A":"H"},
    11: {2:"D/H",3:"D/H",4:"D/H",5:"D/H",6:"D/H",7:"D/H",8:"D/H",9:"D/H",10:"D/H","A":"D/H"},
    12: {2:"H",3:"H",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H","A":"H"},
    13: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H","A":"H"},
    14: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H","A":"H"},
    15: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"R/H","A":"R/H"},
    16: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"R/H",10:"R/H","A":"H"},
    17: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"S",8:"S",9:"S",10:"S","A":"S"}
  };
  
  const softStrategy = {
    13: {2:"H",3:"H",4:"D/H",5:"D/H",6:"D/H",7:"H",8:"H",9:"H",10:"H","A":"H"},  // A,2
    14: {2:"H",3:"H",4:"D/H",5:"D/H",6:"D/H",7:"H",8:"H",9:"H",10:"H","A":"H"},  // A,3
    15: {2:"H",3:"H",4:"D/H",5:"D/H",6:"D/H",7:"H",8:"H",9:"H",10:"H","A":"H"},  // A,4
    16: {2:"H",3:"H",4:"D/H",5:"D/H",6:"D/H",7:"H",8:"H",9:"H",10:"H","A":"H"},  // A,5
    17: {2:"H",3:"D/H",4:"D/H",5:"D/H",6:"D/H",7:"H",8:"H",9:"H",10:"H","A":"H"},  // A,6
    18: {2:"S",3:"D/S",4:"D/S",5:"D/S",6:"D/S",7:"S",8:"S",9:"H",10:"H","A":"H"},  // A,7
    19: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"S",8:"S",9:"S",10:"S","A":"S"},  // A,8
    20: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"S",8:"S",9:"S",10:"S","A":"S"}   // A,9
  };
  
  const splitStrategy = {
    "A": {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"P",9:"P",10:"P","A":"P"},
    10:  {2:"S",3:"S",4:"S",5:"S",6:"S",7:"S",8:"S",9:"S",10:"S","A":"S"},  // Never split 10s
    9:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"S",8:"P",9:"P",10:"S","A":"S"},
    8:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"P",9:"P",10:"P","A":"P"},
    7:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"H",9:"H",10:"H","A":"H"},
    6:   {2:"P/H",3:"P",4:"P",5:"P",6:"P",7:"H",8:"H",9:"H",10:"H","A":"H"},
    5:   {2:"D/H",3:"D/H",4:"D/H",5:"D/H",6:"D/H",7:"D/H",8:"D/H",9:"D/H",10:"H","A":"H"},
    4:   {2:"H",3:"H",4:"H",5:"P/H",6:"P/H",7:"H",8:"H",9:"H",10:"H","A":"H"},
    3:   {2:"P/H",3:"P/H",4:"P",5:"P",6:"P",7:"P",8:"H",9:"H",10:"H","A":"H"},
    2:   {2:"P/H",3:"P/H",4:"P",5:"P",6:"P",7:"P",8:"H",9:"H",10:"H","A":"H"}
  };

  
  function handTotal(cards) {
    let sum = 0;
    let aces = 0;
    for (let c of cards) {
      if (c === "A") {
        aces++;
        sum += 11;
      } else {
        sum += c;
      }
    }
    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces--;
    }
    return sum;
  }
  
  function isSoft(cards) {
    return cards.includes("A");
  }
  
  function expandMove(code) {
    // Handle compound moves: D/H, D/S, P/H, R/H
    if (code === "D/H") return "DOUBLE"; // Double if allowed, otherwise Hit
    if (code === "D/S") return "DOUBLE"; // Double if allowed, otherwise Stand
    if (code === "P/H") return "SPLIT";  // Split if double after split allowed, otherwise Hit
    if (code === "R/H") return "SURRENDER"; // Surrender if allowed, otherwise Hit
    
    // Simple moves
    return {
      "H": "HIT",
      "S": "STAND",
      "D": "DOUBLE",
      "P": "SPLIT",
      "R": "SURRENDER"
    }[code] || "HIT";
  }
  
  function getMove(player, dealer) {
    const total = handTotal(player);
    const soft = isSoft(player);
    
    // If player has busted, always stand (game over for player)
    if (total > 21) return "STAND";
    
    // Check for pairs (split) - must check before soft/hard totals
    if (player.length === 2 && player[0] === player[1]) {
      const rank = player[0];
      if (splitStrategy[rank] && splitStrategy[rank][dealer]) {
        return expandMove(splitStrategy[rank][dealer]);
      }
    }
    
    // Check soft totals (hands with Ace counted as 11)
    if (soft) {
      const strat = softStrategy[total];
      if (strat && strat[dealer]) return expandMove(strat[dealer]);
    }
    
    // Check hard totals (no Ace counted as 11, or Ace counted as 1)
    const strat = hardStrategy[total];
    if (strat && strat[dealer]) return expandMove(strat[dealer]);
    
    // Default fallback for totals not in tables (shouldn't happen)
    if (total >= 18) return "STAND";
    return "HIT";
  }
  
  // Probability calculations
  function calculateProbabilities(player, dealer) {
    const playerTotal = handTotal(player);
    const dealerValue = dealer === "A" ? 11 : dealer;
    
    // Standard deck card probabilities (simplified - assumes infinite deck)
    const cardProbs = {
      2: 1/13, 3: 1/13, 4: 1/13, 5: 1/13, 6: 1/13, 7: 1/13, 8: 1/13, 9: 1/13,
      10: 4/13, // 10, J, Q, K
      "A": 1/13
    };

    // Calculate dealer's probability of busting or getting specific totals
    const dealerOutcomes = calculateDealerOutcomes(dealerValue, cardProbs);
    
    // Probability of winning if we stand
    const winProbStand = calculateWinProbabilityStand(playerTotal, dealerOutcomes);
    
    // Probability of winning if we hit (one card)
    const { winProb: winProbHit, bustProb: bustProbHit } = calculateHitOutcomes(player, cardProbs, dealerOutcomes);
    
    // Probability of winning if we double (same as hit but only one card)
    const { winProb: winProbDouble } = calculateHitOutcomes(player, cardProbs, dealerOutcomes);

    return {
      winProbStand,
      winProbHit,
      bustProbHit,
      winProbDouble
    };
  }

  function calculateDealerOutcomes(dealerUpCard, cardProbs) {
    // Simplified dealer probability calculation using Monte Carlo simulation
    const outcomes = {};
    const simulations = 10000;
    
    for (let i = 0; i < simulations; i++) {
      let total = dealerUpCard;
      let hasAce = dealerUpCard === 11;
      
      // Dealer hits until 17 or higher
      while (total < 17) {
        // Draw a random card based on probabilities
        const rand = Math.random();
        let card = null;
        let cumProb = 0;
        
        for (const [c, prob] of Object.entries(cardProbs)) {
          cumProb += prob;
          if (rand <= cumProb) {
            card = c;
            break;
          }
        }
        
        if (!card) card = "10"; // fallback
        
        // Add card to total
        if (card === "A") {
          total += 11;
          hasAce = true;
        } else {
          total += parseInt(card);
        }
        
        // Adjust for aces if needed
        if (total > 21 && hasAce) {
          total -= 10;
          hasAce = false;
        }
        
        // Prevent infinite loop
        if (total < 7) break;
      }
      
      // Record outcome
      if (total > 21) {
        outcomes.bust = (outcomes.bust || 0) + 1;
      } else {
        outcomes[total] = (outcomes[total] || 0) + 1;
      }
    }
    
    // Normalize to probabilities
    for (const key in outcomes) {
      outcomes[key] /= simulations;
    }
    
    return outcomes;
  }

  function calculateWinProbabilityStand(playerTotal, dealerOutcomes) {
    let winProb = 0;
    
    // Win if dealer busts
    winProb += dealerOutcomes.bust || 0;
    
    // Win if dealer gets lower total
    for (const [total, prob] of Object.entries(dealerOutcomes)) {
      if (total !== "bust" && parseInt(total) < playerTotal) {
        winProb += prob;
      }
    }
    
    return Math.min(1, Math.max(0, winProb));
  }

  function calculateHitOutcomes(player, cardProbs, dealerOutcomes) {
    let winProb = 0;
    let bustProb = 0;
    const playerTotal = handTotal(player);
    
    // Try each possible card we could draw
    for (const [card, prob] of Object.entries(cardProbs)) {
      const newHand = [...player, card === "A" ? "A" : parseInt(card)];
      const newTotal = handTotal(newHand);
      
      if (newTotal > 21) {
        // We bust
        bustProb += prob;
      } else {
        // Calculate win probability with this new total
        const winProbWithCard = calculateWinProbabilityStand(newTotal, dealerOutcomes);
        winProb += prob * winProbWithCard;
      }
    }
    
    return {
      winProb: Math.min(1, Math.max(0, winProb)),
      bustProb: Math.min(1, Math.max(0, bustProb))
    };
  }

  // Create overlay with modern UI
  let overlayBox = null;
  
  function createOverlay() {
    if (overlayBox) return;
    
    overlayBox = document.createElement("div");
    overlayBox.id = "bj-helper-overlay";
    overlayBox.innerHTML = `
      <div class="bj-header">
        <div class="bj-title">🎰 Blackjack Helper</div>
        <div class="bj-status">Waiting for cards...</div>
      </div>
      <div class="bj-content">
        <div class="bj-hand-info">
          <div class="bj-hand-row">
            <span class="bj-label">Your Hand:</span>
            <span class="bj-value" id="bj-player-hand">-</span>
          </div>
          <div class="bj-hand-row">
            <span class="bj-label">Dealer Card:</span>
            <span class="bj-value" id="bj-dealer-card">-</span>
          </div>
        </div>
        <div class="bj-recommendation">
          <div class="bj-move-label">Recommended Move</div>
          <div class="bj-move" id="bj-move">-</div>
        </div>
        <div class="bj-probabilities">
          <div class="bj-prob-title">Win Probability</div>
          <div class="bj-prob-grid">
            <div class="bj-prob-item">
              <span class="bj-prob-label">Stand:</span>
              <span class="bj-prob-value" id="bj-prob-stand">-</span>
            </div>
            <div class="bj-prob-item">
              <span class="bj-prob-label">Hit:</span>
              <span class="bj-prob-value" id="bj-prob-hit">-</span>
            </div>
            <div class="bj-prob-item">
              <span class="bj-prob-label">Double:</span>
              <span class="bj-prob-value" id="bj-prob-double">-</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      #bj-helper-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
        z-index: 999999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        color: #ffffff;
        overflow: hidden;
        backdrop-filter: blur(10px);
      }
      .bj-header {
        background: linear-gradient(135deg, #0f3460 0%, #16213e 100%);
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      .bj-title {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 4px;
        color: #4ade80;
        letter-spacing: 0.5px;
      }
      .bj-status {
        font-size: 12px;
        color: #94a3b8;
        font-weight: 400;
      }
      .bj-content {
        padding: 20px;
      }
      .bj-hand-info {
        margin-bottom: 20px;
      }
      .bj-hand-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;
      }
      .bj-label {
        color: #94a3b8;
        font-weight: 500;
      }
      .bj-value {
        color: #ffffff;
        font-weight: 600;
        font-size: 16px;
      }
      .bj-recommendation {
        background: linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%);
        border: 2px solid rgba(74, 222, 128, 0.3);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 20px;
        text-align: center;
      }
      .bj-move-label {
        font-size: 11px;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        font-weight: 600;
      }
      .bj-move {
        font-size: 28px;
        font-weight: 800;
        color: #4ade80;
        text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
        letter-spacing: 1px;
      }
      .bj-probabilities {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 16px;
      }
      .bj-prob-title {
        font-size: 12px;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 12px;
        font-weight: 600;
        text-align: center;
      }
      .bj-prob-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
      }
      .bj-prob-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        font-size: 13px;
      }
      .bj-prob-label {
        color: #cbd5e1;
        font-weight: 500;
      }
      .bj-prob-value {
        color: #4ade80;
        font-weight: 700;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlayBox);
    console.log("[BJ Helper] Overlay created");
  }
  
  function updateOverlay(move, playerHand, dealerCard, stats) {
    if (!overlayBox) createOverlay();
    
    const formatHand = (cards) => {
      return cards.map(c => c === "A" ? "A" : c).join(", ");
    };
    
    const formatPercent = (prob) => {
      return (prob * 100).toFixed(1) + "%";
    };
    
    // Update hand info
    document.getElementById("bj-player-hand").textContent = playerHand ? formatHand(playerHand) : "-";
    document.getElementById("bj-dealer-card").textContent = dealerCard ? (dealerCard === "A" ? "A" : dealerCard) : "-";
    
    // Update move
    document.getElementById("bj-move").textContent = move || "-";
    
    // Update probabilities
    if (stats) {
      document.getElementById("bj-prob-stand").textContent = formatPercent(stats.winProbStand);
      document.getElementById("bj-prob-hit").textContent = formatPercent(stats.winProbHit);
      document.getElementById("bj-prob-double").textContent = formatPercent(stats.winProbDouble);
    } else {
      document.getElementById("bj-prob-stand").textContent = "-";
      document.getElementById("bj-prob-hit").textContent = "-";
      document.getElementById("bj-prob-double").textContent = "-";
    }
    
    // Update status
    const statusEl = overlayBox.querySelector(".bj-status");
    if (statusEl) {
      statusEl.textContent = move ? "Ready" : "Waiting for cards...";
    }
  }
  
  // Card stability check - wait for cards to be fully loaded
  let lastCardState = null;
  let stableCount = 0;
  const STABLE_THRESHOLD = 3; // Cards must be stable for 3 checks (1.5 seconds)
  const CHECK_INTERVAL = 500; // Check every 500ms
  
  function getCardState() {
    const { player, dealer } = readCards();
    return JSON.stringify({ player, dealer });
  }
  
  // Main loop
  createOverlay();
  
  function loop() {
    try {
      const currentState = getCardState();
      const { player, dealer } = readCards();
      
      // Check if cards have changed
      if (currentState !== lastCardState) {
        lastCardState = currentState;
        stableCount = 0;
        updateOverlay("Reading cards...", null, null, null);
        console.log("[BJ Helper] Cards changed, re-reading...");
        return;
      }
      
      // Cards haven't changed - increment stability counter
      stableCount++;
      
      // Wait for cards to be stable before making recommendation
      if (stableCount < STABLE_THRESHOLD) {
        updateOverlay(`Reading... (${stableCount}/${STABLE_THRESHOLD})`, null, null, null);
        return;
      }
      
      // Cards are stable - make recommendation (but keep checking for changes)
      if (!player.length || !dealer) {
        updateOverlay("Waiting...", null, null, null);
        return;
      }
      
      const total = handTotal(player);
      const soft = isSoft(player);
      const move = getMove(player, dealer);
      const stats = calculateProbabilities(player, dealer);
      
      updateOverlay(move, player, dealer, stats);
      
      // Log every check with details
      console.log("[BJ Helper] Player:", player.join(", "), `(Total: ${total}${soft ? ' soft' : ''})`, "| Dealer:", dealer, "| Move:", move);
      console.log("[BJ Helper] Probabilities - Stand:", (stats.winProbStand * 100).toFixed(1) + "%", "Hit:", (stats.winProbHit * 100).toFixed(1) + "%", "Double:", (stats.winProbDouble * 100).toFixed(1) + "%");
    } catch (e) {
      console.error("[BJ Helper] Error:", e);
    }
  }
  
  // Run immediately and then continuously every 500ms
  loop();
  setInterval(loop, CHECK_INTERVAL);
  
  console.log("[BJ Helper] Script running! Continuously checking cards every", CHECK_INTERVAL, "ms");
  console.log("[BJ Helper] Waiting for cards to be stable before showing recommendations...");
})();

