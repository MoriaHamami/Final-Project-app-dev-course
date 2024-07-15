// קוד JavaScript לפתיחת וסגירת הפופאפ
$(document).ready(function() {
    // כאשר לוחצים על כפתור הקניות
    $('.cart-btn').click(function(e) {
        e.preventDefault(); // למנוע פעולת ברירת המחדל של הקישור
        $('.shopping-cart').fadeIn(); // להצגת הפופאפ
    });

    // כאשר לוחצים על הכפתור לסגירת הפופאפ
    $('.shopping-cart .close-btn').click(function() {
        $('.shopping-cart').fadeOut(); // להסתרת הפופאפ
    });

    // כאשר לוחצים על רקע הכהה
    $('.dark-screen').click(function() {
        $('.shopping-cart').fadeOut(); // להסתרת הפופאפ
    });
});
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
