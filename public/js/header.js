function getCartPage() {
    $(location).attr('href', '/cart');
}

function getLoggedInUser() {
    $.ajax({
        url: '/login/isLogged',
        method: 'GET',
        contentType: 'application/json',
        success: function(user) {
            if (!user) {
                $(location).attr('href', '/login');
            } else if (user.isManager) {
                $(location).attr('href', '/manager');
            } else {
                $(location).attr('href', '/client');
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}