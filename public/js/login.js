// Function to fetch user details from the server
function fetchUserDetails() {
    $.ajax({
        url: '/user/details', // Endpoint to get user details
        method: 'GET', // HTTP GET request
        dataType: 'json', // Expect JSON response
        success: function(user) {
            var signinButton = $('#signin-button');
            if (signinButton.length) {
                signinButton.text(`Hello, ${user.username}`); // Update button text with username
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching user details:', textStatus, errorThrown);
            showNotice('Error fetching user details'); // Show error notice
        }
    });
}

// Call the fetchUserDetails function when the page loads
fetchUserDetails();

// Function to show a notice message
function showNotice(message, redirectToCart = false) {
    $('#noticeModalBody').text(message); // Set the notice message
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {}); // Initialize the modal
    noticeModal.show(); // Show the modal

    // Hide the modal or redirect after 2 seconds
    setTimeout(function() {
        if (redirectToCart) {
            window.location.href = '/cart'; // Redirect to cart page
        } else {
            noticeModal.hide(); // Hide the modal
        }
    }, 2000);
}
