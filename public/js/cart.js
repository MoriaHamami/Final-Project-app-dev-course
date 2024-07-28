$(document).ready(function() {
    // Handle click events on the "Remove" text and trash icon
    $(document).on('click', '.icon-text, .bi-trash3', function() {
        const cartItemId = $(this).data('cart-item-id');
        console.log('Sending cartItemId:', cartItemId); // Debugging
        removeItem(cartItemId);
    });
});

async function removeItem(cartItemId) {
    try {
        console.log('Removing item:', cartItemId); // Debugging
        const response = await $.ajax({
            url: '/cart/remove',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                cartItemId: cartItemId
            })
        });

        console.log('Response from server:', response); // Debugging

        if (response.success) {
            showNotice('Product removed from cart successfully', function() {
                window.location.reload(); // רענון הדף לאחר הצגת ההודעה
            });
        } else {
            showNotice(response.message || 'Error removing product from cart');
        }
    } catch (e) {
        console.log('Error removing product from cart:', e);
        showNotice('Error removing product from cart');
    }
}

function showNotice(message, callback) {
    var noticeModalBody = document.getElementById('noticeModalBody');
    if (noticeModalBody) {
        noticeModalBody.innerText = message;
        var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
        noticeModal.show();

        // Close the modal after 2 seconds
        setTimeout(function() {
            noticeModal.hide();
            if (callback) {
                callback();
            }
        }, 2000);
    } else {
        console.error('Notice modal body not found');
    }
}



// פונקציה לעדכון סה"כ הפריטים בעגלה
function showLargePopup() {
    var popup = document.getElementById('largePopup');
    popup.style.display = 'block';
    setTimeout(function() {
        popup.style.display = 'none';
    }, 3000); // Display for 3 seconds
}

async function proceedToShipping() {
    try {
        const response = await $.ajax({
            url: '/cart/checkout',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                cartItems: window.cartItems // כאן משתמשים במשתנה cartItems
            })
        });

        if (response.success) {
            showLargePopup();
            setTimeout(function() {
                window.location.assign('/'); // Redirect to the home page
            }, 3000); // Wait for the popup to disappear before redirecting
        } else {
            showNotice(response.message || 'Error processing order');
        }
    } catch (e) {
        console.log('Error processing order:', e);
        showNotice('Error processing order');
    }
}

function showLargePopup() {
    var popup = document.getElementById('largePopup');
    popup.style.display = 'block';
    setTimeout(function() {
        popup.style.display = 'none';
    }, 3000); // Display for 3 seconds
}




