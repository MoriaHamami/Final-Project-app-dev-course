$(document).ready(function() {
    $('.carousel').carousel();
});

// Functions to control carousel sliding and pausing
function prevSlide() {
    $('.carousel').carousel('prev');
    $('.carousel').carousel('pause');
}

function nextSlide() {
    $('.carousel').carousel('next');
    $('.carousel').carousel('pause');
}

async function addToCart(productId) {
    const selectedSize = document.querySelector('input[name="options-base"]:checked')?.value;

    // Ensure size is selected if the product requires a size
    if (document.querySelector('.product_sizes') && !selectedSize) {
        showNotice('Please select a size', false);
        return;
    }

    try {
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.8',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                productId: productId,
                size: selectedSize
            }),
            credentials: 'include'
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showNotice('The product has been successfully added', false); // No redirect
        } else {
            showNotice(result.message || 'Error adding product to cart', false);
        }
    } catch (e) {
        showNotice('Error adding product to cart', false);
    }
}

async function getEditProductPage(id) {
    try {
        window.location.assign('/products/edit/' + id);
    } catch (e) {
        console.log("Could not get edit page");
    }
}

// Function to show notice and redirect
function showNotice(message, redirectToCart) {
    document.getElementById('noticeModalBody').innerText = message;
    var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
    noticeModal.show();

    // Adding a delay before redirect or hiding modal
    setTimeout(function() {
        if (redirectToCart) {
            window.location.href = '/cart'; // Redirect to the cart page after 2 seconds
        } else {
            noticeModal.hide(); // Hide modal and stay on the same page
        }
    }, 2000);
}


async function buyNow(productId) {
    await addToCart(productId); // Add to cart
    window.location.href = '/cart'; // Redirect to the cart page
}
