document.addEventListener("DOMContentLoaded", function () {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const ownerUsername = localStorage.getItem('ownerUsername');

  const userInfo = document.getElementById('user-info');
  const adminButton = document.getElementById('admin-button');

  if (loggedInUser) {
      const userEmail = localStorage.getItem('loggedInEmail');
      userInfo.textContent = `Username: ${loggedInUser} | Email: ${userEmail}`;

      // Display balances
      const wlBalance = localStorage.getItem(`balance_wl_${loggedInUser}`) || 0;
      const dlBalance = localStorage.getItem(`balance_dl_${loggedInUser}`) || 0;
      const bglBalance = localStorage.getItem(`balance_bgl_${loggedInUser}`) || 0;

      document.getElementById('wl-balance').textContent = wlBalance;
      document.getElementById('dl-balance').textContent = dlBalance;
      document.getElementById('bgl-balance').textContent = bglBalance;

      // Show admin button if user is the owner
      if (loggedInUser === ownerUsername) {
          adminButton.classList.remove('hidden');
      }
  } else {
      alert('You are not logged in.');
      window.location.href = 'index.html'; // Redirect to home page if not logged in
  }
});

function logout() {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loggedInEmail');
  window.location.href = 'index.html';
}
