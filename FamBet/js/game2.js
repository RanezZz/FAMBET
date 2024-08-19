document.addEventListener('DOMContentLoaded', function() {
  let gameActive = false;
  let betPlaced = false;
  let cashedOut = false;
  let betAmount = 0;
  let multiplier = 1;
  let selectedCurrency = getSelectedCurrency(); // Get selected currency from localStorage

  // Update balances and username on page load
  updateBalance();

  // Clear the broadcast list on page load
  const broadcastList = document.getElementById('broadcast-list');
  broadcastList.innerHTML = '';

  // Set the selected currency in the dropdown
  document.getElementById('currency-select').value = selectedCurrency;

  // Event listener for placing a bet
  document.getElementById('bet-button').addEventListener('click', function() {
    if (betPlaced) {
      alert('You already placed a bet. Wait for the round to finish.');
      return; // Prevent placing multiple bets
    }

    betAmount = parseFloat(document.getElementById('bet-input').value);
    selectedCurrency = document.getElementById('currency-select').value;
    setSelectedCurrency(selectedCurrency); // Save selected currency to localStorage

    const numberOfMines = parseInt(document.getElementById('mines-select').value);

    if (isNaN(betAmount) || betAmount <= 0) {
      alert('Please enter a valid bet amount.');
      return;
    }

    if (!placeBet(betAmount, selectedCurrency)) {
      document.getElementById('status').textContent = 'Not enough balance.';
      return;
    }

    if (isNaN(numberOfMines) || numberOfMines < 1 || numberOfMines > 24) {
      alert('Please select a valid number of mines between 1 and 24.');
      return;
    }

    multiplier = 1; // Reset multiplier
    startGame(numberOfMines);
    gameActive = true;
    betPlaced = true; // Mark bet as placed
    cashedOut = false; // Reset cashout status
    document.getElementById('cashout-button').style.display = 'inline-block'; // Show cash out button
    document.getElementById('status').textContent = 'Game in progress...'; // Update status
  });

  // Event listener for "All In" button
  document.getElementById('all-in-button').addEventListener('click', function() {
    selectedCurrency = document.getElementById('currency-select').value;
    setSelectedCurrency(selectedCurrency); // Save selected currency to localStorage
    const balance = parseFloat(getCurrencyBalance(selectedCurrency));

    if (balance > 0) {
      document.getElementById('bet-input').value = balance.toFixed(2); // Set bet input to the total balance
    } else {
      alert('Not enough balance to go all in.');
    }
  });

  // Event listener for cashing out
  document.getElementById('cashout-button').addEventListener('click', function() {
    if (!gameActive || cashedOut) {
      alert('You cannot cash out multiple times.');
      return; // Prevent multiple cashouts
    }

    const winnings = betAmount * multiplier;
    updateBalanceAfterWin(winnings);
    document.getElementById('status').textContent = `You cashed out with ${winnings.toFixed(2)} winnings!`;

    const currentUser = document.getElementById('username').textContent.trim();
    addBroadcastEntry(currentUser, winnings.toFixed(2), selectedCurrency);

    endGame();
    cashedOut = true; // Mark as cashed out
  });

  function placeBet(amount, currency) {
    let balance = parseFloat(getCurrencyBalance(currency));

    if (balance >= amount) {
      setCurrencyBalance(currency, (balance - amount).toFixed(2));
      return true;
    }
    return false;
  }

  function startGame(numMines) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    const gridSize = 5;
    const totalCells = gridSize * gridSize;
    const mines = generateMines(numMines, totalCells);

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement('div');
      cell.className = 'game-cell';
      cell.dataset.index = i;
      cell.addEventListener('click', function() {
        if (gameActive) {
          handleCellClick(cell, mines);
        }
      });
      gameBoard.appendChild(cell);
    }

    updateInfoBox(); // Update multiplier and potential cashout initially
  }

  function handleCellClick(cell, mines) {
    const cellIndex = parseInt(cell.dataset.index);

    if (mines.has(cellIndex)) {
      cell.style.background = 'red'; // Mine hit
      cell.textContent = '💣'; // Show a bomb icon
      document.getElementById('status').textContent = 'Game Over! You hit a mine!';
      revealMines(mines); // Reveal all mines
      endGame();
    } else {
      cell.style.background = 'green'; // Safe cell
      cell.textContent = '✔';
      multiplier += 0.1; // Increase multiplier for each safe cell
      updateInfoBox(); // Update multiplier and potential cashout
    }
    cell.classList.add('clicked');
  }

  function revealMines(mines) {
    document.querySelectorAll('.game-cell').forEach(cell => {
      const cellIndex = parseInt(cell.dataset.index);
      if (mines.has(cellIndex)) {
        cell.style.background = 'red'; // Mine
        cell.textContent = '💣'; // Show a bomb icon
      }
    });
  }

  function updateBalanceAfterWin(winnings) {
    let balance = parseFloat(getCurrencyBalance(selectedCurrency));
    setCurrencyBalance(selectedCurrency, (balance + winnings).toFixed(2));
  }

  function endGame() {
    document.querySelectorAll('.game-cell').forEach(cell => {
      cell.removeEventListener('click', handleCellClick);
    });
    document.getElementById('cashout-button').style.display = 'none'; // Hide cash out button
    gameActive = false;
    betPlaced = false; // Reset betPlaced so new bets can be placed
  }

  function updateInfoBox() {
    const potentialCashout = (betAmount * multiplier).toFixed(2);
    document.getElementById('current-multiplier').textContent = `Multiplier: ${multiplier.toFixed(1)}x`;
    document.getElementById('potential-cashout').textContent = `Potential Cashout: ${potentialCashout}`;
    fadeInInfoBox(); // Apply fade-in effect
  }

  function updateBalance() {
    // Fetch balance from local storage
    ['wl', 'dl', 'bgl'].forEach(currency => {
      const balance = getCurrencyBalance(currency);
      document.getElementById(`${currency}-balance`).textContent = balance;
    });
  }

  // Function to get currency balance from localStorage
  function getCurrencyBalance(currency) {
    return localStorage.getItem(`${currency}-balance`) || '0.00';
  }

  // Function to set currency balance in localStorage
  function setCurrencyBalance(currency, balance) {
    localStorage.setItem(`${currency}-balance`, balance);
  }

  // Function to get selected currency from localStorage
  function getSelectedCurrency() {
    return localStorage.getItem('selected-currency') || 'bgl'; // Default to 'bgl' if not set
  }

  // Function to set selected currency in localStorage
  function setSelectedCurrency(currency) {
    localStorage.setItem('selected-currency', currency);
  }

  // Apply fade-in effect to info box elements
  function fadeInInfoBox() {
    const infoElements = [document.getElementById('current-multiplier'), document.getElementById('potential-cashout')];
    infoElements.forEach(element => {
      element.style.opacity = 0;
      setTimeout(() => {
        element.style.transition = 'opacity 0.5s ease-in-out';
        element.style.opacity = 1;
      }, 0);
    });
  }
});

// Broadcast function for cashouts
function addBroadcastEntry(username, amount, currency) {
  const broadcastList = document.getElementById('broadcast-list');
  const listItem = document.createElement('li');
  
  const currencyIcons = {
    wl: '/img/wl-icon.png',
    dl: '/img/dl-icon.png',
    bgl: '/img/bgl-icon.png'
  };

  const currencyIcon = currencyIcons[currency] || '/img/default-icon.png'; // Default icon if not found
  listItem.innerHTML = `<span style="color: white;">${username} cashed out ${amount} <img src="${currencyIcon}" alt="${currency}"></span>`;
  broadcastList.prepend(listItem); // Add new item at the top
}
