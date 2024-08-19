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
          if (!localStorage.getItem(`balance_wl_${username}`)) localStorage.setItem(`balance_wl_${username}`, '0');
          if (!localStorage.getItem(`balance_dl_${username}`)) localStorage.setItem(`balance_dl_${username}`, '0');
          if (!localStorage.getItem(`balance_bgl_${username}`)) localStorage.setItem(`balance_bgl_${username}`, '0');

          alert('Login successful!');
          window.location.href = 'index.html';
      } else {
          alert('Invalid username or password. Please try again.');
      }
  }
});
