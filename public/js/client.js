async function logout() {
    try {
        // Send AJAX request to log out
        await $.ajax({
            url: '/login/logout', // Logout URL
            method: 'GET', // Request method
            contentType: 'application/json', // Content type
        });
    } catch (e) {
        // If request fails, print error
        console.error('Error during logout:', e);
    }
}
