function fetchUserDetails() {
    $.ajax({
        url: '/user/details', 
        method: 'GET',
        dataType: 'json',
        success: function(user) {
            var signinButton = $('#signin-button');
            if (signinButton.length) {
                signinButton.text(`Hello, ${user.username}`);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error fetching user details:', textStatus, errorThrown);
            showNotice('Error fetching user details');
        }
    });
}

// קריאה לפונקציה עם טעינת הדף
fetchUserDetails();


function showNotice(message, redirectToCart = false) {
    $('#noticeModalBody').text(message);
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {});
    noticeModal.show();


    setTimeout(function() {
        if (redirectToCart) {
            window.location.href = '/cart'; 
        } else {
            noticeModal.hide();
        }
    }, 2000);
}