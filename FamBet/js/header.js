document.addEventListener("DOMContentLoaded", function () {
  const loggedInUser = localStorage.getItem('loggedInUser');

  if (loggedInUser) {
      const wlBalance = localStorage.getItem(`balance_wl_${loggedInUser}`) || 0;
      const dlBalance = localStorage.getItem(`balance_dl_${loggedInUser}`) || 0;
      const bglBalance = localStorage.getItem(`balance_bgl_${loggedInUser}`) || 0;

      document.getElementById('wl-balance').textContent = wlBalance;
      document.getElementById('dl-balance').textContent = dlBalance;
      document.getElementById('bgl-balance').textContent = bglBalance;

      document.getElementById('username').textContent = loggedInUser;
      document.getElementById('login-button').style.display = 'none';
      document.getElementById('logout-button').style.display = 'inline';

      const ownerUsername = localStorage.getItem('ownerUsername');
      if (loggedInUser === ownerUsername) {
          document.getElementById('admin-button').classList.remove('hidden');
      }
  } else {
      document.getElementById('login-button').style.display = 'inline';
      document.getElementById('logout-button').style.display = 'none';
  }
});

function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loggedInEmail');
  window.location.href = 'index.html';
}
