$(document).ready(function() {
    $('.cart-btn').click(function(e) {
        e.preventDefault();
        $('.shopping-cart').fadeIn();
    });

    $('.shopping-cart .close-btn').click(function() {
        $('.shopping-cart').fadeOut();
    });

    $('.dark-screen').click(function() {
        $('.shopping-cart').fadeOut();
    });
});
zz
async function removeItem(productId) {
    try {
        const response = await $.ajax({
            url: '/cart/remove',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                productId: productId
            })
        });

        alert('Product removed from cart successfully');
        window.location.reload();
    } catch (e) {
        console.log('Error removing product from cart:', e);
        alert('Error removing product from cart');
    }
}
