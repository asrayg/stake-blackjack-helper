export function readCards() {
  // Find dealer cards - look for div with data-testid="dealer" and card elements inside
  const dealerContainer = document.querySelector('[data-testid="dealer"]');
  const playerContainer = document.querySelector('[data-testid="player"]');
  
  const parseCard = (cardElement) => {
    // Find the span with the card value
    const valueSpan = cardElement.querySelector('span');
    if (!valueSpan) return null;
    
    const valueText = valueSpan.textContent.trim();
    
    // Parse card value
    if (valueText === 'A' || valueText === 'a') return "A";
    if (valueText === 'K' || valueText === 'k') return 10;
    if (valueText === 'Q' || valueText === 'q') return 10;
    if (valueText === 'J' || valueText === 'j') return 10;
    
    const num = parseInt(valueText);
    if (!isNaN(num) && num >= 2 && num <= 10) return num;
    
    return null;
  };

  const player = [];
  const dealer = [];

  // Get player cards
  if (playerContainer) {
    const playerCards = playerContainer.querySelectorAll('[data-testid^="card-"]');
    playerCards.forEach(card => {
      const value = parseCard(card);
      if (value !== null) player.push(value);
    });
  }

  // Get dealer cards (only first visible card)
  if (dealerContainer) {
    const dealerCards = dealerContainer.querySelectorAll('[data-testid^="card-"]');
    if (dealerCards.length > 0) {
      const firstCard = parseCard(dealerCards[0]);
      if (firstCard !== null) dealer.push(firstCard);
    }
  }

  return { 
    player, 
    dealer: dealer.length > 0 ? dealer[0] : null 
  };
}

