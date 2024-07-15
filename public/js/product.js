$('.carousel').carousel();

// ביטול החלקה
function prevSlide() {
    $('.carousel').carousel('prev');
    $('.carousel').carousel('pause');
}

function nextSlide() {
    $('.carousel').carousel('next');
    $('.carousel').carousel('pause');
}


// ********************************************************************************
async function addToCart(productId, size) {
  try {
      const response = await $.ajax({
          url: '/cart/add',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
              productId: productId,
              size: size
          })
      });

      if (response.message === "Product added to cart successfully") {
          // הצגת המודאל
          var myModal = new bootstrap.Modal(document.getElementById('cartModal'), {});
          myModal.show();

          // הוספת מאזין לאירוע הסגירה של המודאל
          $('#cartModal').on('hidden.bs.modal', function () {
              window.location.href = '/products'; // הפניה לעמוד המוצרים לאחר סגירת המודאל
          });
      } else {
          alert('Error adding product to cart');
      }
  } catch (e) {
      console.log('Error adding product to cart:', e);
      alert('Error adding product to cart');
  }
}