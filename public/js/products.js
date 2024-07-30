// Global variables for updating use
let gPrice = 0;
let gTitle = '';
let gCat = '';
let gSortIsAsc = {
    price: true,
    title: true
};

var timeOutFunctionId;


function updateOutput(newPrice) {
    
    $("output").text(newPrice);
}

function setCat(newCat) {
    gCat = newCat;
    getProductsBy();
}

function setTitle(newTitle) {
    gTitle = newTitle;
   
    clearTimeout(timeOutFunctionId);
    
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


async function sortProductsBy(sortVal) {
    try {
        
        await getProductsBy(sortVal, gSortIsAsc[sortVal]);
       
        gSortIsAsc[sortVal] = !gSortIsAsc[sortVal];
       
        const capSortVal = sortVal.charAt(0).toUpperCase() + sortVal.slice(1);
       
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
        
        $('#productsList').html('<div class="container" style="width:100vw;height:100%;display:flex;align-items:center;justify-content:center;"><img src="/styles/imgs/general/loader.webp" alt="loader" style="width:30%;padding:40px"></div>');

       
        const response = await $.ajax({
            url: `/products/filter?filters[price]=${gPrice}&filters[title]=${gTitle}&filters[cat]=${gCat}&sort[sortVal]=${sortVal}&sort[isAsc]=${isAsc}`,
            method: 'GET',
            contentType: 'application/json',
        });

        
        console.log('Response from server:', response);

       
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
                    showNotice(response.message, false); 
                } else {
                    console.error('Error toggling wishlist:', response.error);
                    showNotice('Error: ' + response.error, false);
                }
            }
        },
        error: function(error) {
            if (error.status === 401) {
                showNotice('In order to add to the wishlist, you have to log in', true); 
            } else {
                console.error('Error toggling wishlist:', error);
                showNotice('Error: ' + error.responseText, false);
            }
        }
    });
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