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
