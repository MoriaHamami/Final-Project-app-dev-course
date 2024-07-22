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

async function addToCart(productId, redirectToCart = false) {
    let selectedSize;
    const sizeElement = document.querySelector('input[name="options-base"]:checked');
    if (sizeElement) {
        selectedSize = sizeElement.value;
    } else {
        selectedSize = null; // No size selected
    }

    const selectedQuantity = parseInt(document.getElementById('quantitySelect').value, 10);
    console.log('Selected size:', selectedSize); // Debugging
    console.log('Selected quantity:', selectedQuantity); // Debugging

    try {
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                productId: productId,
                size: selectedSize,
                quantity: selectedQuantity
            }),
            credentials: 'include'
        });
        

          // הוספת מאזין לאירוע הסגירה של המודאל
          if (response.ok) {
            $('#cartModal').on('hidden.bs.modal', function () {
              window.location.href = '/products'; // הפניה לעמוד המוצרים לאחר סגירת המודאל
            
          });
          try{
            const result = await response.json();
    
            if (result.message === "Product added to cart successfully") {
                console.log('Success message received'); // Debugging
                showNotice('Product added to cart successfully', redirectToCart);
            } else {
                console.error('Unexpected response message:', result.message); // Debugging
                showNotice('Error adding product to cart', false);
            }
        } catch (e) {
            console.error('Error in try-catch block:', e); // Debugging
            showNotice('Error adding product to cart', false);
        }
      } 
      else {
          alert('Error adding product to cart');
      }
      
  } catch (e) {
      console.log('Error adding product to cart:', e);
      alert('Error adding product to cart');
  }
}

async function getEditProductPage( id) {
    try {
        // Prevents product to be shown. Only editor will be opened.
        // ev.stopPropagation()
        window.location.assign('/products/edit/' + id)
        // await $.ajax({
        //     url: `/products/edit/${id}`,
        //     method: 'GET',
        //     contentType: 'application/json',
        //     params: id
        // })
    } catch (e) {
        console.log("Could not get edit page")
    }
    
}

// Function to show notice and redirect
function showNotice(message, redirectToCart) {
    document.getElementById('noticeModalBody').innerText = message;
    var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
    noticeModal.show();

    // Adding a delay before redirect
    setTimeout(function() {
        if (redirectToCart) {
            window.location.href = '/cart'; // Redirect to the cart page after 1 second
        } else {
            noticeModal.hide();
        }
    }, 1000);
}

function buyNow(productId) {
    addToCart(productId, true);
}
