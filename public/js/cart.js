$(document).ready(function() {
    // Open the shopping cart when the button is clicked
    $('.cart-btn').click(function(e) {
        e.preventDefault();
        $('.shopping-cart').fadeIn();
    });

    // Close the shopping cart when the close button is clicked
    $('.shopping-cart .close-btn').click(function() {
        $('.shopping-cart').fadeOut();
    });

    // Close the shopping cart when the dark screen is clicked
    $('.dark-screen').click(function() {
        $('.shopping-cart').fadeOut();
    });

    // Handle click events on the "Remove" text and trash icon
    $(document).on('click', '.icon-text, .bi-trash3', function() {
        const productId = $(this).data('product-id');
        const size = $(this).data('product-size');
        removeItem(productId, size);
    });
});


async function removeItem(productId, size) {
    try {
        console.log('Removing item:', productId, size); // Debugging
        const response = await $.ajax({
            url: '/cart/remove',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                productId: productId,
                size: size
            })
        });

        console.log('Response from server:', response); // Debugging

        if (response.success) {
            showNotice('Product removed from cart successfully');
            const productElement = $(`.product:has([data-product-id='${productId}'][data-product-size='${size}'])`);
            console.log('Product element:', productElement); // Debugging

            productElement.fadeOut(400, function() {
                $(this).remove();
                updateCartItemCount();
            });
        } else {
            showNotice(response.message || 'Error removing product from cart');
        }
    } catch (e) {
        console.log('Error removing product from cart:', e);
        showNotice('Error removing product from cart');
    }
}

 



// פונקציה להצגת הודעה קטנה
function showNotice(message) {
    console.log('Showing notice:', message); // Debugging
    var noticeModalBody = document.getElementById('noticeModalBody');
    if (noticeModalBody) {
        noticeModalBody.innerText = message;
        var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
        noticeModal.show();

        // סגירת המודל לאחר 2 שניות
        setTimeout(function() {
            noticeModal.hide();
        }, 3000);
    } else {
        console.error('Notice modal body not found');
    }
}


// פונקציה לעדכון סה"כ הפריטים בעגלה
function updateCartItemCount() {
    const itemCount = $('.product').length;
    console.log('Updated item count:', itemCount); // Debugging
    $('h2').text(`Your basket | ${itemCount}`);
}

// פונקציה לסיום רכישה
async function proceedToShipping() {
    try {
        const response = await $.ajax({
            url: '/orders/add',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                cartItems: window.cartItems // כאן משתמשים במשתנה cartItems
            })
        });

        if (response.success) {
            showNotice('Thank you for your purchase!');
            setTimeout(function() {
                window.location.assign('/shipping');
            }, 2000);
        } else {
            showNotice(response.message || 'Error processing order');
        }
    } catch (e) {
        console.log('Error processing order:', e);
        showNotice('Error processing order');
    }
}


