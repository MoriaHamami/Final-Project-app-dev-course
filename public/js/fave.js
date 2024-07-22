$(document).ready(function() {
    $('.fave-btn').click(function(e) {
        e.preventDefault();
        $('.shopping-fave').fadeIn();
    });

    $('.shopping-fave .close-btn').click(function() {
        $('.shopping-fave').fadeOut();
    });

    $('.dark-screen').click(function() {
        $('.shopping-fave').fadeOut();
    });
});

async function removeItemFave(productId) {
    try {
        const response = await $.ajax({
            url: '/fave/remove',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                productId: productId
            })
        });

        alert('Product removed from fave successfully');
        window.location.reload();
    } catch (e) {
        console.log('Error removing product from fave:', e);
        alert('Error removing product from fave');
    }
}
