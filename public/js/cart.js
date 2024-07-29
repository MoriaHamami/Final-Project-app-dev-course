$(document).ready(function() {
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
            data: JSON.stringify({ cartItemId })
        });

        console.log('Response from server:', response); // Debugging

        if (response.success) {
            showNotice('Product removed from cart successfully', function() {
                window.location.reload();
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

async function proceedToShipping() {
    try {
        const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

        const response = await $.ajax({
            url: '/cart/checkout',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ cartTotal })
        });

        if (response.success) {
            showNotice('Thank you for your purchase!');
            setTimeout(function() {
                window.location.assign('/');
            }, 2000);
        } else {
            showNotice(response.message || 'Error processing order');
        }
    } catch (e) {
        console.log('Error processing order:', e);
        showNotice('Error processing order');
    }
}

async function addToCart(productId, size, quantity) {
    try {
        const response = await $.ajax({
            url: '/cart/add',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ productId, size, quantity })
        });

        if (response.success) {
            showNotice('Product added to cart successfully');
        } else {
            showNotice(response.message || 'Error adding product to cart');
        }
    } catch (e) {
        console.log('Error adding product to cart:', e);
        showNotice('Error adding product to cart');
    }
}
