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

// Function to show the large popup
function showLargePopup(message) {
    var largePopup = document.querySelector('.large-popup');
    var largePopupContent = document.querySelector('.large-popup-content');

    if (largePopup && largePopupContent) {
        largePopupContent.innerHTML = `<h1>${message}</h1>`;
        largePopup.style.display = 'flex'; // Show the popup
        
        // Hide the popup after a few seconds
        setTimeout(function() {
            largePopup.style.display = 'none'; // Hide the popup
            window.location.assign('/'); // Redirect after closing the popup
        }, 2000); // Adjust time as needed
    } else {
        console.error('Large popup or content not found');
    }
}

// Updated proceedToShipping function
async function proceedToShipping() {
    // בדיקה אם העגלה ריקה
    if (cartItems.length === 0) {
        showNotice('Your cart is empty.');
        return;
    }

    // בדיקה אם כל הפרטים מלאים
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const country = document.getElementById('country').value.trim();
    const address = document.getElementById('address').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const city = document.getElementById('city').value.trim();

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
