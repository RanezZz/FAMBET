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
          localStorage.setItem(`balance_wl_${username}`, '0');
          localStorage.setItem(`balance_dl_${username}`, '0');
          localStorage.setItem(`balance_bgl_${username}`, '0');

          alert('Registration successful! You can now log in.');
      }
  }
});
