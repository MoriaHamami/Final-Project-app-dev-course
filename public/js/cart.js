$(document).ready(function() {
    // Event listener for removing an item from the cart
    $(document).on('click', '.icon-text, .bi-trash3', function() {
        const cartItemId = $(this).data('cart-item-id');
        console.log('Sending cartItemId:', cartItemId); // Debugging
        removeItem(cartItemId);
    });
});

/**
 * Remove an item from the cart.
 * @param {string} cartItemId - The ID of the cart item to be removed.
 */
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

/**
 * Show a notice message to the user.
 * @param {string} message - The message to display.
 * @param {function} [callback] - Optional callback function to run after the notice is hidden.
 */
function showNotice(message, callback) {
    console.log('Showing notice:', message); // Debugging
    var $noticeModalBody = $('#noticeModalBody');
    if ($noticeModalBody.length) {
        $noticeModalBody.text(message);
        var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {});
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

/**
 * Show a large popup with a message.
 * @param {string} message - The message to display in the popup.
 */
function showLargePopup(message) {
    var $largePopup = $('.large-popup');
    var $largePopupContent = $('.large-popup-content');

    if ($largePopup.length && $largePopupContent.length) {
        $largePopupContent.html(`<h1>${message}</h1>`);
        $largePopup.css('display', 'flex'); // Show the popup

        // Hide the popup after a few seconds
        setTimeout(function() {
            $largePopup.css('display', 'none'); // Hide the popup
            window.location.assign('/'); // Redirect after closing the popup
        }, 2000); // Adjust time as needed
    } else {
        console.error('Large popup or content not found');
    }
}

/**
 * Proceed to the shipping step in the checkout process.
 */
async function proceedToShipping() {
    // Check if the cart is empty
    if (cartItems.length === 0) {
        showNotice('Your cart is empty.');
        return;
    }

    // Check if all fields are filled
    const fullName = $('#fullName').val().trim();
    const email = $('#email').val().trim();
    const phoneNumber = $('#phoneNumber').val().trim();
    const country = $('#country').val().trim();
    const address = $('#address').val().trim();
    const postalCode = $('#postalCode').val().trim();
    const city = $('#city').val().trim();

    if (!fullName || !email || !phoneNumber || !country || !address || !postalCode || !city) {
        showNotice('Please fill in all required fields.');
        return;
    }

    try {
        const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

        const response = await $.ajax({
            url: '/cart/checkout',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ cartTotal })
        });

        if (response.success) {
            showLargePopup('Thank you for your purchase!');
        } else {
            showNotice(response.message || 'Error processing order');
        }
    } catch (e) {
        console.log('Error processing order:', e);
        showNotice('Error processing order');
    }
}

/**
 * Add a product to the cart.
 * @param {string} productId - The ID of the product to add.
 * @param {string} size - The size of the product.
 * @param {number} quantity - The quantity of the product.
 */
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
