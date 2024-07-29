// Global variables for updating use
let gPrice = 0;
let gTitle = '';
let gCat = '';
let gSortIsAsc = {
    price: true,
    title: true
};

var timeOutFunctionId;

// Update the values of the global variables according to the changes in the input
function updateOutput(newPrice) {
    // When the slider moves, show in output the value
    $("output").text(newPrice);
}

function setCat(newCat) {
    gCat = newCat;
    getProductsBy();
}

function setTitle(newTitle) {
    gTitle = newTitle;
    // clearTimeOut to reset the timer 
    clearTimeout(timeOutFunctionId);
    // Updates the products only after the user finished typing
    timeOutFunctionId = setTimeout(getProductsBy, 200);
}

function setPrice(newPrice) {
    gPrice = newPrice;
    $('.price-val').text(newPrice);
    getProductsBy();
}

function updatePriceVal(newPrice) {
    $('.price-val').text(newPrice);
}

// When clicking on the sort buttons, do the following:
async function sortProductsBy(sortVal) {
    try {
        // Send the sort value (price or title) and if we want the sort to ascend or descend
        await getProductsBy(sortVal, gSortIsAsc[sortVal]);
        // After the products are sorted and shown, change the isAsc value for next time use
        gSortIsAsc[sortVal] = !gSortIsAsc[sortVal];
        // Save a capitalized version of the sort value
        const capSortVal = sortVal.charAt(0).toUpperCase() + sortVal.slice(1);
        // Change the icon showing the ascend and descend direction in sort button
        $(`.products .sortBy${capSortVal}Btn`).html(`
            <i class="bi bi-caret-${gSortIsAsc[sortVal] ? 'up' : 'down'}"></i>
            Sort By ${capSortVal}
        `);
    } catch (e) {
        console.log('Products were not sorted successfully');
    }
}

async function getProductsBy(sortVal = '', isAsc = true) {
    try {
        // Show loader until loaded
        $('#productsList').html('<div class="container" style="width:100vw;height:100%;display:flex;align-items:center;justify-content:center;"><img src="/styles/imgs/general/loader.webp" alt="loader" style="width:30%;padding:40px"></div>');

        // Send a get request with the param and sort values from the updated global variables
        const response = await $.ajax({
            url: `/products/filter?filters[price]=${gPrice}&filters[title]=${gTitle}&filters[cat]=${gCat}&sort[sortVal]=${sortVal}&sort[isAsc]=${isAsc}`,
            method: 'GET',
            contentType: 'application/json',
        });

        // Check the response from the server
        console.log('Response from server:', response);

        // Create a long string that represents the HTML of products we want to be shown after we got the products from the DB (filtered and sorted)
        let str = '';
        for (let i = 0; i < response.length; i++) {
            str += `
                <a class="image-container" href="/products/product/${response[i]._id}">
                    <img src="${response[i].srcImg[0]?.includes('data:') ? response[i].srcImg[0] : ('/styles/imgs/products/' + response[i].srcImg[0])}" alt="product">
                    <div class="image-name">${response[i].title}</div>
                    <div class="price">${response[i].price}$</div>
                    <!-- כפתור הלב להוספת לרשימת המשאלות -->
                    <button class="wishlist-btn ${favoriteProductIds.includes(response[i]._id.toString()) ? 'wishlist-active' : ''}" onclick="toggleWishlist(event, this, '${response[i]._id}')">
                        <i class="${favoriteProductIds.includes(response[i]._id.toString()) ? 'bi bi-heart-fill' : 'bi bi-heart'}"></i>
                    </button>
                </a>`;
        }

        // Inside the products area in the HTML, show all the products
        $('#productsList').html(str);
    } catch (e) {
        console.log('Error:', e);
        // TODO: Later show an error modal
        $('#productsList').html('<p class="error-message">Error loading products. Please try again.</p>');
    }
}


$(document).ready(() => {
    getProductsBy();
});


function toggleWishlist(event, button, productId) {
    event.preventDefault();
    event.stopPropagation();

    const icon = button.querySelector('i');
    const isAdding = !icon.classList.contains('bi-heart-fill');

    $.ajax({
        url: `/products/toggle-wishlist`,
        method: 'POST',
        data: JSON.stringify({ productId, isAdding }),
        contentType: 'application/json',
        success: function(response) {
            if (response.success) {
                icon.classList.toggle('bi-heart');
                icon.classList.toggle('bi-heart-fill');
                button.classList.toggle('wishlist-active');
                const message = isAdding ? 'Item successfully added to wishlist' : 'Item removed from wishlist';
                showNotice(message, false);
            } else {
                if (response.message) {
                    showNotice(response.message, false); // הצגת הודעת השגיאה
                } else {
                    console.error('Error toggling wishlist:', response.error);
                    showNotice('Error: ' + response.error, false);
                }
            }
        },
        error: function(error) {
            if (error.status === 401) {
                showNotice('עליך להתחבר תחילה כדי להוסיף למועדפים.', true); // הצגת הודעת החיבור
            } else {
                console.error('Error toggling wishlist:', error);
                showNotice('Error: ' + error.responseText, false);
            }
        }
    });
}

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
    }, 2000);
}
