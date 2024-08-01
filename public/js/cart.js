let gCartItems = []

$(document).ready(function() {
    // Event listener for removing an item from the cart
    $(document).on('click', '.icon-text, .bi-trash3', function() {
        const cartItemId = $(this).data('cart-item-id');
        console.log('Sending cartItemId:', cartItemId); // Debugging
        removeItem(cartItemId);
    });
    updateCartItems()
});


//  Updates initial cart items from db
function updateCartItems() {
    $.ajax({
        url: '/cart/cartItems', // API endpoint to getCartItems
        method: 'GET',
        contentType: 'application/json',
        success: function(cartItems) {
            gCartItems = cartItems
        },
        error: function(error) {
            // Log any errors to the console
            console.error('Error:', error);
        }
    });
}
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

async function proceedToShipping() {
    // Check if the cart is empty
    if (gCartItems.length === 0) {
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
        const cartTotal = gCartItems.reduce((total, item) => total + item.price, 0);

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

async function goToProductsPage(){
    window.location.assign('/products'); 
}