document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById('search-button');
    const updateButton = document.getElementById('update-button');
    const searchUsernameInput = document.getElementById('search-username');
    const userInfoDiv = document.getElementById('user-info');
    const statusElement = document.getElementById('status');

    searchButton.addEventListener('click', function() {
        const username = searchUsernameInput.value.trim();
        if (username === '') {
            alert('Please enter a username.');
            return;
        }

        // Simulate an API call to get user data
        const wlBalance = localStorage.getItem(`balance_wl_${username}`) || 0;
        const dlBalance = localStorage.getItem(`balance_dl_${username}`) || 0;
        const bglBalance = localStorage.getItem(`balance_bgl_${username}`) || 0;

        if (wlBalance !== null) {
            document.getElementById('user-name').textContent = username;
            document.getElementById('user-wl').textContent = wlBalance;
            document.getElementById('user-dl').textContent = dlBalance;
            document.getElementById('user-bgl').textContent = bglBalance;
            document.getElementById('update-wl').value = wlBalance;
            document.getElementById('update-dl').value = dlBalance;
            document.getElementById('update-bgl').value = bglBalance;
            userInfoDiv.style.display = 'block';
            statusElement.textContent = '';
        } else {
            statusElement.textContent = 'User not found.';
        }
    });

    updateButton.addEventListener('click', function() {
        const username = document.getElementById('user-name').textContent;
        if (username === '') {
            alert('No user selected.');
            return;
        }

        const newWl = parseFloat(document.getElementById('update-wl').value) || 0;
        const newDl = parseFloat(document.getElementById('update-dl').value) || 0;
        const newBgl = parseFloat(document.getElementById('update-bgl').value) || 0;

        localStorage.setItem(`balance_wl_${username}`, newWl);
        localStorage.setItem(`balance_dl_${username}`, newDl);
        localStorage.setItem(`balance_bgl_${username}`, newBgl);

        document.getElementById('user-wl').textContent = newWl;
        document.getElementById('user-dl').textContent = newDl;
        document.getElementById('user-bgl').textContent = newBgl;

        statusElement.textContent = 'Balances updated successfully.';
    });
});
