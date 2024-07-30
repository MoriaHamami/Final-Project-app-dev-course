$(document).ready(function() {
    $('.carousel').carousel();
});


function prevSlide() {
    $('.carousel').carousel('prev');
    $('.carousel').carousel('pause');
}

function nextSlide() {
    $('.carousel').carousel('next');
    $('.carousel').carousel('pause');
}

async function addToCart(productId) {
    const selectedSize = $('input[name="options-base"]:checked').val();

    if ($('.product_sizes').length && !selectedSize) {
        showNotice('Please select a size', false);
        return;
    }

    try {
        const response = await $.ajax({
            url: '/cart/add',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                productId: productId,
                size: selectedSize
            }),
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.8',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (response && response.success) {
            showNotice('The product has been successfully added', false); 
        } else {
            showNotice(response.message || 'Error adding product to cart', false);
        }
    } catch (error) {
        showNotice('Error adding product to cart', false);
    }
}

function getEditProductPage(id) {
    try {
        $(location).attr('href', '/products/edit/' + id);
    } catch (e) {
        console.log("Could not get edit page");
    }
}

function showNotice(message, redirectToCart) {
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

function buyNow(productId) {
    $.when(addToCart(productId)).done(function() {
        window.location.href = '/cart'; 
    });
}