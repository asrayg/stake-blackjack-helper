(function() {
  'use strict';
  
  let stats = { wins: 0, losses: 0, games: 0 };
  
  function readCards() {
    const player = [];
    const dealer = [];
    
    const dealerContainer = document.querySelector('[data-testid="dealer"]');
    const playerContainer = document.querySelector('[data-testid="player"]');
    
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
    
    if (dealerContainer) {
      const dealerCards = dealerContainer.querySelectorAll('[data-testid^="card-"]');
      for (const card of dealerCards) {
        const faceContent = card.querySelector('.face-content');
        if (faceContent) {
          const span = faceContent.querySelector('span');
          if (span && span.textContent.trim()) {
            const value = parseCardValue(span);
            if (value !== null) {
              dealer.push(value);
              break;
            }
          }
        }
      }
    }
    
    if (playerContainer) {
      const playerCards = playerContainer.querySelectorAll('[data-testid^="card-"]');
      for (const card of playerCards) {
        const faceContent = card.querySelector('.face-content');
        if (faceContent) {
          const span = faceContent.querySelector('span');
          if (span && span.textContent.trim()) {
            const value = parseCardValue(span);
            if (value !== null) {
              player.push(value);
            }
          }
        }
      }
    }
    
    return { player, dealer: dealer.length > 0 ? dealer[0] : null };
  }
  
  const hardStrategy = {
    8:  {2:"H",3:"H",4:"H",5:"H",6:"H",7:"H",8:"H",9:"H",10:"H","A":"H"},
    9:  {2:"H",3:"DD",4:"DD",5:"DD",6:"DD",7:"H",8:"H",9:"H",10:"H","A":"H"},
    10: {2:"DD",3:"DD",4:"DD",5:"DD",6:"DD",7:"DD",8:"DD",9:"DD",10:"H","A":"H"},
    11: {2:"DD",3:"DD",4:"DD",5:"DD",6:"DD",7:"DD",8:"DD",9:"DD",10:"DD","A":"DD"},
    12: {2:"H",3:"H",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H","A":"H"},
    13: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H","A":"H"},
    14: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H","A":"H"},
    15: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H/R","A":"H"},
    16: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H/R",10:"H/R","A":"H"},
    17: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"S",8:"S",9:"S",10:"S","A":"S"}
  };
  
  const softStrategy = {
    13: {2:"H",3:"H",4:"DD",5:"DD",6:"DD",7:"H",8:"H",9:"H",10:"H","A":"H"},
    14: {2:"H",3:"H",4:"DD",5:"DD",6:"DD",7:"H",8:"H",9:"H",10:"H","A":"H"},
    15: {2:"H",3:"H",4:"DD",5:"DD",6:"DD",7:"H",8:"H",9:"H",10:"H","A":"H"},
    16: {2:"H",3:"H",4:"DD",5:"DD",6:"DD",7:"H",8:"H",9:"H",10:"H","A":"H"},
    17: {2:"H",3:"DD",4:"DD",5:"DD",6:"DD",7:"H",8:"H",9:"H",10:"H","A":"H"},
    18: {2:"S",3:"DD",4:"DD",5:"DD",6:"DD",7:"S",8:"S",9:"H",10:"H","A":"H"},
    19: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"S",8:"S",9:"S",10:"S","A":"S"},
    20: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"S",8:"S",9:"S",10:"S","A":"S"}
  };
  
  const splitStrategy = {
    "A": {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"P",9:"P",10:"P","A":"P"},
    10:  {2:"S",3:"S",4:"S",5:"S",6:"S",7:"S",8:"S",9:"S",10:"S","A":"S"},
    9:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"S",8:"P",9:"P",10:"S","A":"S"},
    8:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"P",9:"P",10:"P","A":"P"},
    7:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"H",9:"H",10:"H","A":"H"},
    6:   {2:"H/P",3:"P",4:"P",5:"P",6:"P",7:"H",8:"H",9:"H",10:"H","A":"H"},
    5:   {2:"DD",3:"DD",4:"DD",5:"DD",6:"DD",7:"DD",8:"DD",9:"DD",10:"H","A":"H"},
    4:   {2:"H",3:"H",4:"H/P",5:"H/P",6:"H/P",7:"H",8:"H",9:"H",10:"H","A":"H"},
    3:   {2:"H/P",3:"H/P",4:"P",5:"P",6:"P",7:"P",8:"H",9:"H",10:"H","A":"H"},
    2:   {2:"H/P",3:"H/P",4:"P",5:"P",6:"P",7:"P",8:"H",9:"H",10:"H","A":"H"}
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
    if (code === "DD") return "DOUBLE";
    if (code === "H/R") return "SURRENDER";
    if (code === "H/P") return "SPLIT";
    
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
    
    if (total > 21) return "STAND";
    
    if (player.length === 2 && player[0] === player[1]) {
      const rank = player[0];
      if (splitStrategy[rank] && splitStrategy[rank][dealer]) {
        return expandMove(splitStrategy[rank][dealer]);
      }
    }
    
    if (soft) {
      const strat = softStrategy[total];
      if (strat && strat[dealer]) return expandMove(strat[dealer]);
    }
    
    const strat = hardStrategy[total];
    if (strat && strat[dealer]) return expandMove(strat[dealer]);
    
    if (total >= 18) return "STAND";
    return "HIT";
  }
  
  function calculateProbabilities(player, dealer) {
    const playerTotal = handTotal(player);
    const dealerValue = dealer === "A" ? 11 : dealer;
    
    const cardProbs = {
      2: 1/13, 3: 1/13, 4: 1/13, 5: 1/13, 6: 1/13, 7: 1/13, 8: 1/13, 9: 1/13,
      10: 4/13,
      "A": 1/13
    };

    const dealerOutcomes = calculateDealerOutcomes(dealerValue, cardProbs);
    const winProbStand = calculateWinProbabilityStand(playerTotal, dealerOutcomes);
    const { winProb: winProbHit, bustProb: bustProbHit } = calculateHitOutcomes(player, cardProbs, dealerOutcomes);
    const { winProb: winProbDouble } = calculateHitOutcomes(player, cardProbs, dealerOutcomes);

    return {
      winProbStand,
      winProbHit,
      bustProbHit,
      winProbDouble
    };
  }

  function calculateDealerOutcomes(dealerUpCard, cardProbs) {
    const outcomes = {};
    const simulations = 10000;
    
    for (let i = 0; i < simulations; i++) {
      let total = dealerUpCard;
      let hasAce = dealerUpCard === 11;
      
      while (total < 17) {
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
        
        if (!card) card = "10";
        
        if (card === "A") {
          total += 11;
          hasAce = true;
        } else {
          total += parseInt(card);
        }
        
        if (total > 21 && hasAce) {
          total -= 10;
          hasAce = false;
        }
        
        if (total < 7) break;
      }
      
      if (total > 21) {
        outcomes.bust = (outcomes.bust || 0) + 1;
      } else {
        outcomes[total] = (outcomes[total] || 0) + 1;
      }
    }
    
    for (const key in outcomes) {
      outcomes[key] /= simulations;
    }
    
    return outcomes;
  }

  function calculateWinProbabilityStand(playerTotal, dealerOutcomes) {
    let winProb = 0;
    winProb += dealerOutcomes.bust || 0;
    
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
    
    for (const [card, prob] of Object.entries(cardProbs)) {
      const newHand = [...player, card === "A" ? "A" : parseInt(card)];
      const newTotal = handTotal(newHand);
      
      if (newTotal > 21) {
        bustProb += prob;
      } else {
        const winProbWithCard = calculateWinProbabilityStand(newTotal, dealerOutcomes);
        winProb += prob * winProbWithCard;
      }
    }
    
    return {
      winProb: Math.min(1, Math.max(0, winProb)),
      bustProb: Math.min(1, Math.max(0, bustProb))
    };
  }

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
        <div class="bj-stats">
          <div class="bj-stats-title">Session Stats</div>
          <div class="bj-stats-grid">
            <div class="bj-stat-item">
              <span class="bj-stat-label">Wins:</span>
              <span class="bj-stat-value" id="bj-stat-wins">0</span>
            </div>
            <div class="bj-stat-item">
              <span class="bj-stat-label">Losses:</span>
              <span class="bj-stat-value" id="bj-stat-losses">0</span>
            </div>
            <div class="bj-stat-item">
              <span class="bj-stat-label">Games:</span>
              <span class="bj-stat-value" id="bj-stat-games">0</span>
            </div>
            <div class="bj-stat-item">
              <span class="bj-stat-label">Win Rate:</span>
              <span class="bj-stat-value" id="bj-stat-rate">0%</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
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
        margin-bottom: 20px;
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
      .bj-stats {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 16px;
      }
      .bj-stats-title {
        font-size: 12px;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 12px;
        font-weight: 600;
        text-align: center;
      }
      .bj-stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .bj-stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        font-size: 13px;
      }
      .bj-stat-label {
        color: #cbd5e1;
        font-weight: 500;
      }
      .bj-stat-value {
        color: #4ade80;
        font-weight: 700;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlayBox);
  }
  
  function updateStats() {
    if (!overlayBox) return;
    document.getElementById("bj-stat-wins").textContent = stats.wins;
    document.getElementById("bj-stat-losses").textContent = stats.losses;
    document.getElementById("bj-stat-games").textContent = stats.games;
    const rate = stats.games > 0 ? ((stats.wins / stats.games) * 100).toFixed(1) : 0;
    document.getElementById("bj-stat-rate").textContent = rate + "%";
  }
  
  function updateOverlay(move, playerHand, dealerCard, stats) {
    if (!overlayBox) createOverlay();
    
    const formatHand = (cards) => {
      return cards.map(c => c === "A" ? "A" : c).join(", ");
    };
    
    const formatPercent = (prob) => {
      return (prob * 100).toFixed(1) + "%";
    };
    
    document.getElementById("bj-player-hand").textContent = playerHand ? formatHand(playerHand) : "-";
    document.getElementById("bj-dealer-card").textContent = dealerCard ? (dealerCard === "A" ? "A" : dealerCard) : "-";
    document.getElementById("bj-move").textContent = move || "-";
    
    if (stats) {
      document.getElementById("bj-prob-stand").textContent = formatPercent(stats.winProbStand);
      document.getElementById("bj-prob-hit").textContent = formatPercent(stats.winProbHit);
      document.getElementById("bj-prob-double").textContent = formatPercent(stats.winProbDouble);
    } else {
      document.getElementById("bj-prob-stand").textContent = "-";
      document.getElementById("bj-prob-hit").textContent = "-";
      document.getElementById("bj-prob-double").textContent = "-";
    }
    
    const statusEl = overlayBox.querySelector(".bj-status");
    if (statusEl) {
      statusEl.textContent = move ? "Ready" : "Waiting for cards...";
    }
    
    updateStats();
  }
  
  function readAllCards() {
    const player = [];
    const dealer = [];
    
    const dealerContainer = document.querySelector('[data-testid="dealer"]');
    const playerContainer = document.querySelector('[data-testid="player"]');
    
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
    
    if (dealerContainer) {
      const dealerCards = dealerContainer.querySelectorAll('[data-testid^="card-"]');
      for (const card of dealerCards) {
        const faceContent = card.querySelector('.face-content');
        if (faceContent) {
          const span = faceContent.querySelector('span');
          if (span && span.textContent.trim()) {
            const value = parseCardValue(span);
            if (value !== null) {
              dealer.push(value);
            }
          }
        }
      }
    }
    
    if (playerContainer) {
      const playerCards = playerContainer.querySelectorAll('[data-testid^="card-"]');
      for (const card of playerCards) {
        const faceContent = card.querySelector('.face-content');
        if (faceContent) {
          const span = faceContent.querySelector('span');
          if (span && span.textContent.trim()) {
            const value = parseCardValue(span);
            if (value !== null) {
              player.push(value);
            }
          }
        }
      }
    }
    
    return { player, dealer };
  }
  
  let lastCardState = null;
  let stableCount = 0;
  let lastGameState = null;
  let gameInProgress = false;
  const STABLE_THRESHOLD = 3;
  const CHECK_INTERVAL = 500;
  
  function getCardState() {
    const { player, dealer } = readCards();
    return JSON.stringify({ player, dealer });
  }
  
  createOverlay();
  
  function loop() {
    try {
      const currentState = getCardState();
      const { player, dealer } = readCards();
      const allCards = readAllCards();
      
      const hasCards = player.length > 0 || dealer;
      const hasAllCards = allCards.player.length > 0 && allCards.dealer.length > 0;
      
      if (hasAllCards && !gameInProgress) {
        gameInProgress = true;
        lastGameState = {
          player: [...allCards.player],
          dealer: [...allCards.dealer]
        };
      }
      
      if (currentState !== lastCardState) {
        lastCardState = currentState;
        stableCount = 0;
        
        if (gameInProgress && !hasCards && lastGameState) {
          const finalCards = readAllCards();
          if (finalCards.player.length > 0 && finalCards.dealer.length > 0) {
            const playerTotal = handTotal(finalCards.player);
            const dealerTotal = handTotal(finalCards.dealer);
            
            let playerWon = false;
            if (playerTotal > 21) {
              playerWon = false;
            } else if (dealerTotal > 21) {
              playerWon = true;
            } else if (playerTotal > dealerTotal) {
              playerWon = true;
            } else if (playerTotal < dealerTotal) {
              playerWon = false;
            }
            
            stats.games++;
            if (playerWon) {
              stats.wins++;
            } else {
              stats.losses++;
            }
            updateStats();
          }
          gameInProgress = false;
          lastGameState = null;
        }
        
        if (hasCards) {
          updateOverlay("Reading cards...", null, null, null);
        } else {
          updateOverlay("Waiting...", null, null, null);
        }
        return;
      }
      
      if (!hasCards) {
        gameInProgress = false;
        updateOverlay("Waiting...", null, null, null);
        return;
      }
      
      stableCount++;
      
      if (stableCount < STABLE_THRESHOLD) {
        updateOverlay(`Reading... (${stableCount}/${STABLE_THRESHOLD})`, null, null, null);
        return;
      }
      
      if (!player.length || !dealer) {
        updateOverlay("Waiting...", null, null, null);
        return;
      }
      
      const move = getMove(player, dealer);
      const probStats = calculateProbabilities(player, dealer);
      
      updateOverlay(move, player, dealer, probStats);
    } catch (e) {
    }
  }
  
  loop();
  setInterval(loop, CHECK_INTERVAL);
})();
