export const hardStrategy = {
  8:  {2:"H",3:"H",4:"H",5:"H",6:"H",7:"H",8:"H",9:"H",10:"H","A":"H"},
  9:  {2:"H",3:"D",4:"D",5:"D",6:"D",7:"H",8:"H",9:"H",10:"H","A":"H"},
  10: {2:"D",3:"D",4:"D",5:"D",6:"D",7:"D",8:"D",9:"D",10:"H","A":"H"},
  11: {2:"D",3:"D",4:"D",5:"D",6:"D",7:"D",8:"D",9:"D",10:"D","A":"D"},
  12: {2:"H",3:"H",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H","A":"H"},
  13: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H","A":"H"},
  14: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H","A":"H"},
  15: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H","A":"H"},
  16: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"H",8:"H",9:"H",10:"H","A":"H"},
  17: {2:"S",3:"S",4:"S",5:"S",6:"S",7:"S",8:"S",9:"S",10:"S","A":"S"}
};

export const softStrategy = {
  13: {2:"H",3:"H",4:"H",5:"D",6:"D",7:"H",8:"H",9:"H",10:"H","A":"H"},
  14: {2:"H",3:"H",4:"H",5:"D",6:"D",7:"H",8:"H",9:"H",10:"H","A":"H"},
  15: {2:"H",3:"H",4:"D",5:"D",6:"D",7:"H",8:"H",9:"H",10:"H","A":"H"},
  16: {2:"H",3:"H",4:"D",5:"D",6:"D",7:"H",8:"H",9:"H",10:"H","A":"H"},
  17: {2:"H",3:"D",4:"D",5:"D",6:"D",7:"H",8:"H",9:"H",10:"H","A":"H"},
  18: {2:"S",3:"D",4:"D",5:"D",6:"D",7:"S",8:"S",9:"H",10:"H","A":"H"}
};

export const splitStrategy = {
  "A": {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"P",9:"P",10:"P","A":"P"},
  8:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"P",9:"P",10:"P","A":"P"},
  9:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"S",9:"P",10:"S","A":"S"},
  7:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"H",9:"H",10:"H","A":"H"},
  6:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"H",8:"H",9:"H",10:"H","A":"H"},
  4:   {2:"H",3:"H",4:"H",5:"P",6:"P",7:"H",8:"H",9:"H",10:"H","A":"H"},
  3:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"H",9:"H",10:"H","A":"H"},
  2:   {2:"P",3:"P",4:"P",5:"P",6:"P",7:"P",8:"H",9:"H",10:"H","A":"H"}
};

export function getMove(player, dealer) {
  const total = handTotal(player);
  const soft = isSoft(player);

  // split
  if (player.length === 2 && player[0] === player[1]) {
    const rank = player[0];
    if (splitStrategy[rank] && splitStrategy[rank][dealer]) {
      return expandMove(splitStrategy[rank][dealer]);
    }
  }

  // soft totals
  if (soft) {
    const strat = softStrategy[total];
    if (strat && strat[dealer]) return expandMove(strat[dealer]);
  }

  // hard totals
  const strat = hardStrategy[total];
  if (strat && strat[dealer]) return expandMove(strat[dealer]);

  return "HIT";
}

function expandMove(code) {
  return {
    "H": "HIT",
    "S": "STAND",
    "D": "DOUBLE",
    "P": "SPLIT"
  }[code] || "HIT";
}

export function isSoft(cards) {
  return cards.includes("A");
}

export function handTotal(cards) {
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

// Calculate probability statistics
export function calculateProbabilities(player, dealer) {
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
  const isSoft = isSoft(player);
  
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

