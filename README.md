# Stake Blackjack Helper - Console Script

A simple console script that reads cards from the Stake blackjack game and provides optimal basic strategy recommendations.

## Usage

1. Open the Stake blackjack game in your browser
2. Open the browser console (F12 or Cmd+Option+I on Mac)
3. Copy the entire contents of `console-script.js`
4. Paste it into the console and press Enter

The script will:
- Continuously read player and dealer cards from the DOM
- Calculate the optimal move using basic strategy
- Display a floating overlay on the page with the recommendation
- Show probability statistics for different moves

## Features

- **Card Detection**: Automatically reads cards from the Stake blackjack DOM
- **Basic Strategy**: Uses optimal blackjack basic strategy tables
- **Probability Calculations**: Shows win probabilities for Hit, Stand, and Double
- **Visual Overlay**: Displays recommendations directly on the game page
- **Continuous Updates**: Re-reads cards and updates recommendations in real-time

## Strategy Tables

The script uses standard blackjack basic strategy including:
- Hard totals (8-17)
- Soft totals (A,2 through A,9)
- Pair splitting rules
- Surrender recommendations (when applicable)

## Notes

- The script waits for cards to stabilize before making recommendations
- It continuously monitors the game state and updates recommendations
- All calculations are done client-side in your browser

