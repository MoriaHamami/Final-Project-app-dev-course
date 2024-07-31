// Redirects the user to the cart page
function getCartPage() {
    $(location).attr('href', '/cart');
}

// Checks if the user is logged in and redirects them based on their role
function getLoggedInUser() {
    $.ajax({
        url: '/login/isLogged', // API endpoint to check login status
        method: 'GET',
        contentType: 'application/json',
        success: function(user) {
            // If the user is not logged in, redirect to the login page
            if (!user) {
                $(location).attr('href', '/login');
            // If the user is a manager, redirect to the manager page
            } else if (user.isManager) {
                $(location).attr('href', '/manager');
            // If the user is a regular client, redirect to the client page
            } else {
                $(location).attr('href', '/client');
            }
        },
        error: function(error) {
            // Log any errors to the console
            console.error('Error:', error);
        }
    });
}
