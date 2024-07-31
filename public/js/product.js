$(document).ready(function() {
    // Initialize carousel
    $('.carousel').carousel();
});

// Function to go to previous slide
function prevSlide() {
    $('.carousel').carousel('prev'); // Move to previous slide
    $('.carousel').carousel('pause'); // Pause carousel
}

// Function to go to next slide
function nextSlide() {
    $('.carousel').carousel('next'); // Move to next slide
    $('.carousel').carousel('pause'); // Pause carousel
}

// Function to add product to cart
async function addToCart(productId) {
    const selectedSize = $('input[name="options-base"]:checked').val(); // Get selected size

    // If size selection is required but not made, show notice
    if ($('.product_sizes').length && !selectedSize) {
        showNotice('Please select a size', false);
        return;
    }

    try {
        // Send AJAX request to add product to cart
        const response = await $.ajax({
            url: '/cart/add', // Endpoint to handle add to cart
            method: 'POST', // HTTP method
            contentType: 'application/json', // Content type for JSON data
            data: JSON.stringify({
                productId: productId, // Send product ID
                size: selectedSize // Send selected size
            }),
            xhrFields: {
                withCredentials: true // Include credentials in request
            },
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        // Show success or error notice based on response
        if (response && response.success) {
            showNotice('The product has been successfully added', false); 
        } else {
            showNotice(response.message || 'Error adding product to cart', false);
        }
    } catch (error) {
        // Show error notice if AJAX request fails
        showNotice('Error adding product to cart', false);
    }
}

// Function to redirect to edit product page
function getEditProductPage(id) {
    try {
        $(location).attr('href', '/products/edit/' + id); // Redirect to edit product page
    } catch (e) {
        console.log("Could not get edit page"); // Log error if redirection fails
    }
}

// Function to show notice modal with message
function showNotice(message, redirectToCart) {
    $('#noticeModalBody').text(message); // Update modal body with message
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {}); // Initialize modal
    noticeModal.show(); // Show modal

    // Adding a delay before redirect or hiding modal
    setTimeout(function() {
        if (redirectToCart) {
            window.location.href = '/cart'; // Redirect to cart page
        } else {
            noticeModal.hide(); // Hide modal
        }
    }, 2000);
}

// Function to add product to cart and redirect to cart page
function buyNow(productId) {
    $.when(addToCart(productId)).done(function() {
        window.location.href = '/cart'; // Redirect to cart page
    });
}
