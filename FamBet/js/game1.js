document.addEventListener("DOMContentLoaded", function () {
  const betButton = document.getElementById('bet-button');
  const cashoutButton = document.getElementById('cashout-button');
  const betInput = document.getElementById('bet-input');
  const currencySelect = document.getElementById('currency-select');
  const statusElement = document.getElementById('status');
  const multiplierElement = document.getElementById('multiplier');
  
  let currentBet = 0;
  let currentCurrency = 'wl';
  let betPlaced = false;
  let multiplierInterval;
  let crashMultiplier;

  // Update current currency when selection changes
  currencySelect.addEventListener('change', function() {
      currentCurrency = currencySelect.value;
  });

  // Handle placing bets
  betButton.addEventListener('click', function() {
      if (betPlaced) {
          statusElement.textContent = 'Please cash out before placing a new bet.';
          return;
      }

      const betAmount = parseFloat(betInput.value);
      if (isNaN(betAmount) || betAmount <= 0) {
          statusElement.textContent = 'Please enter a valid bet amount.';
          return;
      }

      const loggedInUser = localStorage.getItem('loggedInUser');
      if (!loggedInUser) {
          statusElement.textContent = 'You must be logged in to place a bet.';
          return;
      }

      const balanceKey = `balance_${currentCurrency}_${loggedInUser}`;
      let balance = parseFloat(localStorage.getItem(balanceKey)) || 0;

      if (betAmount > balance) {
          statusElement.textContent = `Insufficient ${currentCurrency} balance.`;
          return;
      }

      // Deduct the bet amount from the user's balance
      balance -= betAmount;
      localStorage.setItem(balanceKey, balance);
      document.getElementById(`${currentCurrency}-balance`).textContent = balance;

      // Initialize multiplier and crash logic
      crashMultiplier = Math.random() * 5 + 1; // Random crash point between 1x and 6x
      let currentMultiplier = 1;
      multiplierElement.textContent = `${currentMultiplier.toFixed(2)}x`;
      
      // Start increasing multiplier
      multiplierInterval = setInterval(() => {
          if (currentMultiplier >= crashMultiplier) {
              clearInterval(multiplierInterval);
              statusElement.textContent = 'Game crashed! You can no longer cash out.';
              return;
          }

          currentMultiplier += 0.01; // Adjust increment as needed
          multiplierElement.textContent = `${currentMultiplier.toFixed(2)}x`;
      }, 100); // Update every 100ms

      betPlaced = true;
      currentBet = betAmount;

      statusElement.textContent = `Bet placed: ${currentBet} ${currentCurrency}.`;
  });

  // Handle cashing out
  cashoutButton.addEventListener('click', function() {
      if (!betPlaced) {
          statusElement.textContent = 'No bet placed.';
          return;
      }

      clearInterval(multiplierInterval);

      const loggedInUser = localStorage.getItem('loggedInUser');
      if (!loggedInUser) {
          statusElement.textContent = 'You must be logged in to cash out.';
          return;
      }

      const balanceKey = `balance_${currentCurrency}_${loggedInUser}`;
      let balance = parseFloat(localStorage.getItem(balanceKey)) || 0;

      // Calculate win amount
      const currentMultiplier = parseFloat(multiplierElement.textContent.replace('x', ''));
      const winAmount = currentBet * currentMultiplier;

      // Update the balance with the win amount
      balance += winAmount;
      localStorage.setItem(balanceKey, balance);
      document.getElementById(`${currentCurrency}-balance`).textContent = balance;

      // Reset bet state
      betPlaced = false;
      currentBet = 0;

      statusElement.textContent = `Cashed out: ${winAmount.toFixed(2)} ${currentCurrency}.`;
  });
});

// Place this with the other game logic event handlers
document.getElementById('cashout-button').addEventListener('click', function() {
    if (gameActive) {
        const winnings = betAmount * multiplier;
        updateBalanceAfterWin(winnings);
        document.getElementById('status').textContent = `You cashed out with ${winnings.toFixed(2)} winnings!`;

        // Get the current username and currency being used
        const currentUser = document.getElementById('username').textContent.trim();
        addBroadcastEntry(currentUser, winnings.toFixed(2), selectedCurrency);

        endGame();
    }
});

// Place this with the other game logic event handlers
document.getElementById('cashout-button').addEventListener('click', function() {
    if (gameActive) {
        const winnings = betAmount * multiplier;
        updateBalanceAfterWin(winnings);
        document.getElementById('status').textContent = `You cashed out with ${winnings.toFixed(2)} winnings!`;

        // Get the current username and currency being used
        const currentUser = document.getElementById('username').textContent.trim();
        
        // Ensure selectedCurrency is correctly defined before using it
        if (!selectedCurrency) {
            console.error('Currency is not selected!');
            return;
        }

        // Call broadcast function
        addBroadcastEntry(currentUser, winnings.toFixed(2), selectedCurrency);

        endGame();
    }
});

// Add the 'addBroadcastEntry' function anywhere in your JS file:
function addBroadcastEntry(username, amount, currency) {
    const broadcastList = document.getElementById('broadcast-list');
    const listItem = document.createElement('li');
    
    // Define currency icons
    const currencyIcons = {
        wl: '/img/wl-icon.png',
        dl: '/img/dl-icon.png',
        bgl: '/img/bgl-icon.png'
    };
    
    // Fallback in case the icon for the currency is missing
    const currencyIcon = currencyIcons[currency] || '/img/default-icon.png'; // Default icon
    
    // Create a new list item and add it to the list
    listItem.innerHTML = `${username} cashed out ${amount} <img src="${currencyIcon}" alt="${currency}">`;
    broadcastList.prepend(listItem); // Add new item at the top
}
