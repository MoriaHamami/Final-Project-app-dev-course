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
    console.log('Showing notice:', message); // Debugging
    var noticeModalBody = document.getElementById('noticeModalBody');
    if (noticeModalBody) {
        noticeModalBody.innerText = message;
        var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
        noticeModal.show();

        // סגירת המודל לאחר 2 שניות
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
            showNotice('Thank you for your purchase!');
            setTimeout(function() {
                window.location.assign('/'); // העברה לדף הבית
            }, 2000);
        } else {
            showNotice(response.message || 'Error processing order');
        }
    } catch (e) {
        console.log('Error processing order:', e);
        showNotice('Error processing order');
    }
}


// מוודא שהמשתנה cartItems מוגדר וכולל את פריטי העגלה
var cartItems = <%- JSON.stringify(cartItems || []) %>;

function goToProductsPage() {
    window.location.assign('/products');
}


