// Check if the user is logged in on page load
document.addEventListener("DOMContentLoaded", function () {
  updateHeader();
  updateBalance(); // Update balance display on page load
});

// Function to update the header based on login status
function updateHeader() {
  const authButtons = document.getElementById('auth-buttons');
  const balanceBox = document.getElementById('balance-box');
  const loggedInUser = localStorage.getItem('loggedInUser');

  if (loggedInUser) {
    // User is logged in, display the user's name in bold, and make it clickable to go to the profile page
    authButtons.innerHTML = `
          <span><strong><a href="profile.html" style="color:white; text-decoration:none;">${loggedInUser}</a></strong></span>
      `;

    // Show the balance box
    balanceBox.style.display = 'flex';
  } else {
    // User is not logged in, display login/register buttons
    authButtons.innerHTML = `
          <button onclick="window.location.href='login.html';">Login</button>
          <button onclick="window.location.href='login.html';">Register</button>
      `;

    // Hide the balance box
    balanceBox.style.display = 'none';
  }
}

// Function to update the balance display
function updateBalance() {
  convertBalances(); // Convert balances before updating display

  const balanceBox = document.getElementById('balance-box');
  const wlBalance = localStorage.getItem('balance_wl') || '0';
  const dlBalance = localStorage.getItem('balance_dl') || '0';
  const bglBalance = localStorage.getItem('balance_bgl') || '0';

  document.getElementById('balance-wl').textContent = `WL: ${wlBalance}`;
  document.getElementById('balance-dl').textContent = `DL: ${dlBalance}`;
  document.getElementById('balance-bgl').textContent = `BGL: ${bglBalance}`;
}

// Function to convert WL to DL and DL to BGL
function convertBalances() {
  let wlBalance = parseInt(localStorage.getItem('balance_wl')) || 0;
  let dlBalance = parseInt(localStorage.getItem('balance_dl')) || 0;
  let bglBalance = parseInt(localStorage.getItem('balance_bgl')) || 0;

  // Convert WL to DL
  while (wlBalance >= 100) {
    wlBalance -= 100;
    dlBalance += 1;
  }

  // Convert DL to BGL
  while (dlBalance >= 100) {
    dlBalance -= 100;
    bglBalance += 1;
  }

  // Update localStorage with new balances
  localStorage.setItem('balance_wl', wlBalance);
  localStorage.setItem('balance_dl', dlBalance);
  localStorage.setItem('balance_bgl', bglBalance);
}

// Example functions to handle registration, login, and balance updates
document.getElementById('register-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  if (username && email && password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.find(user => user.username === username);

    if (userExists) {
      alert('Username already taken. Please choose another one.');
    } else {
      users.push({ username, email, password });
      localStorage.setItem('users', JSON.stringify(users));

      // Initialize balances for the new user
      localStorage.setItem('balance_wl', '0');
      localStorage.setItem('balance_dl', '0');
      localStorage.setItem('balance_bgl', '0');

      alert('Registration successful! You can now log in.');
    }
  }
});

document.getElementById('login-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  if (username && password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      localStorage.setItem('loggedInUser', user.username);
      localStorage.setItem('loggedInEmail', user.email);

      // Ensure balance values are initialized
      if (!localStorage.getItem('balance_wl')) localStorage.setItem('balance_wl', '0');
      if (!localStorage.getItem('balance_dl')) localStorage.setItem('balance_dl', '0');
      if (!localStorage.getItem('balance_bgl')) localStorage.setItem('balance_bgl', '0');

      alert('Login successful!');
      window.location.href = 'index.html';
    } else {
      alert('Invalid username or password. Please try again.');
    }
  }
});

function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loggedInEmail');
  // Optionally clear balance data on logout
  // localStorage.removeItem('balance_wl');
  // localStorage.removeItem('balance_dl');
  // localStorage.removeItem('balance_bgl');
  alert('You have logged out.');
  window.location.href = 'index.html';
}

// This is for initial setup; you can run this once when initializing your app
localStorage.setItem('ownerUsername', 'RanezZz'); // Replace 'owner123' with the actual owner username

// Function to add a new broadcast entry
function addBroadcastEntry(username, amount, currency) {
  const broadcastList = document.getElementById('broadcast-list');
  const listItem = document.createElement('li');

  // Define currency icons
  const currencyIcons = {
    wl: '/img/wl-icon.png',
    dl: '/img/dl-icon.png',
    bgl: '/img/bgl-icon.png'
  };

  // Create a new list item
  listItem.innerHTML = `${username} cashed out ${amount} <img src="${currencyIcons[currency]}" alt="${currency}">`;
  broadcastList.prepend(listItem); // Add new item at the top
}

// Example usage when a player cashes out
document.getElementById('cashout-button').addEventListener('click', function () {
  if (gameActive) {
    const winnings = betAmount * multiplier;
    updateBalanceAfterWin(winnings);
    document.getElementById('status').textContent = `You cashed out with ${winnings.toFixed(2)} winnings!`;

    // Assuming 'currentUser' is the logged-in username
    const currentUser = document.getElementById('username').textContent.trim();
    addBroadcastEntry(currentUser, winnings.toFixed(2), selectedCurrency);

    endGame();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const chatMessages = document.getElementById('chat-messages');
  const chatMessageInput = document.getElementById('chat-message-input');
  const sendMessageButton = document.getElementById('send-message');
  
  // Simulate chat history (in production, you'd load this from a server)
  let chatHistory = [];

  // Load chat history from localStorage (or server in production)
  loadChatHistory();

  // Send message event
  sendMessageButton.addEventListener('click', function() {
      const message = chatMessageInput.value.trim();
      const username = document.getElementById('username').textContent.trim() || 'Anonymous';
      
      if (message.length > 0) {
          const messageData = { user: username, text: message };
          chatHistory.push(messageData);
          updateChatDisplay();
          chatMessageInput.value = ''; // Clear input after sending
          saveChatHistory(); // Save to localStorage
      }
  });

  // Listen for Enter key to send the message
  chatMessageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
          sendMessageButton.click();
      }
  });

  // Function to update the chat display
  function updateChatDisplay() {
      chatMessages.innerHTML = ''; // Clear current chat messages
      chatHistory.forEach(msg => {
          const msgElement = document.createElement('p');
          msgElement.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
          chatMessages.appendChild(msgElement);
      });
      chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the bottom
  }

  // Function to save chat history (localStorage for now, in production use a server)
  function saveChatHistory() {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }

  // Function to load chat history
  function loadChatHistory() {
      const storedHistory = localStorage.getItem('chatHistory');
      if (storedHistory) {
          chatHistory = JSON.parse(storedHistory);
          updateChatDisplay();
      }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const chatMessages = document.getElementById('chat-messages');
  const chatMessageInput = document.getElementById('chat-message-input');
  const sendMessageButton = document.getElementById('send-message');
  let chatHistory = [];



});

function addBroadcastEntry(username, amount, currency) {
  const broadcastList = document.getElementById('broadcast-list');
  const listItem = document.createElement('li');
  
  const currencyIcons = {
    wl: '/img/wl-icon.png',
    dl: '/img/dl-icon.png',
    bgl: '/img/bgl-icon.png'
  };

  const currencyIcon = currencyIcons[currency] || '/img/default-icon.png'; // Default icon if not found
  listItem.innerHTML = `${username} cashed out ${amount} <img src="${currencyIcon}" alt="${currency}">`;
  
  // Append new entry
  broadcastList.appendChild(listItem);

  // Scroll to the bottom of the container
  const container = document.getElementById('broadcast-container');
  container.scrollTop = container.scrollHeight;
}

