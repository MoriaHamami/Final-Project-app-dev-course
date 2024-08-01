// Global variables for updating filters and sort options
let gPrice = 0 // Filter by price
let gTitle = '' // Filter by title
let gCat = '' // Filter by category
let gSortIsAsc = { // Sort order
    price: true,
    title: true
}
var timeOutFunctionId // Timeout ID for debounce
let gFaveProductIds = []

// Initialize products list on document ready
$(document).ready(() => {
    getProductsBy()
    updateFaveProductsIds()

})

function updateFaveProductsIds() {
    $.ajax({
        url: '/products/faveIds', // API endpoint to check login status
        method: 'GET',
        contentType: 'application/json',
        success: function(faveIds) {
            gFaveProductIds = faveIds
        },
        error: function(error) {
            // Log any errors to the console
            console.error('Error:', error);
        }
    });
}

// Function to update the price output
function updateOutput(newPrice) {
    $("output").text(newPrice) // Update output element with new price
}

// Function to set the category filter
function setCat(newCat) {
    gCat = newCat // Update global category variable
    getProductsBy() // Fetch products with updated filter
}

// Function to set the title filter with debounce
function setTitle(newTitle) {
    gTitle = newTitle // Update global title variable
   
    clearTimeout(timeOutFunctionId) // Clear previous timeout
   
    timeOutFunctionId = setTimeout(getProductsBy, 200) // Set new timeout for debounce
}

// Function to set the price filter
function setPrice(newPrice) {
    gPrice = newPrice // Update global price variable
    $('.price-val').text(newPrice) // Update price display
    getProductsBy() // Fetch products with updated filter
}

// Function to update the price value display
function updatePriceVal(newPrice) {
    $('.price-val').text(newPrice) // Update price display
}

// Function to sort products by a specified field
async function sortProductsBy(sortVal) {
    try {
        await getProductsBy(sortVal, gSortIsAsc[sortVal]) // Fetch products with sorting

        gSortIsAsc[sortVal] = !gSortIsAsc[sortVal] // Toggle sort order

        const capSortVal = sortVal.charAt(0).toUpperCase() + sortVal.slice(1) // Capitalize sort field

        $(`.products .sortBy${capSortVal}Btn`).html(`
            <i class="bi bi-caret-${gSortIsAsc[sortVal] ? 'up' : 'down'}"></i>
            Sort By ${capSortVal}
        `) // Update sort button display
    } catch (e) {
        console.log('Products were not sorted successfully') // Log error if sorting fails
    }
}

// Function to fetch products based on filters and sorting
async function getProductsBy(sortVal = '', isAsc = true) {
    try {
        $('#productsList').html('<div class="container" style="width:100vw;height:100%;display:flex;align-items:center;justify-content:center;"><img src="/styles/imgs/general/loader.webp" alt="loader" style="width:30%;padding:40px"></div>') // Show loader

        const response = await $.ajax({
            url: `/products/filter?filters[price]=${gPrice}&filters[title]=${gTitle}&filters[cat]=${gCat}&sort[sortVal]=${sortVal}&sort[isAsc]=${isAsc}`, // Endpoint to fetch filtered products
            method: 'GET', // HTTP method
            contentType: 'application/json', // Content type for JSON data
        })

        let str = '' // Initialize HTML string for product list
        if (response.length === 0) {
            str = '<p class="no-products-message">No products available</p>' // Message for no products
        } else {
            for (let i = 0; i < response.length; i++) {
                str += `
                    <a class="image-container" href="/products/product/${response[i]._id}">
                        <img src="${response[i].srcImg[0]?.includes('data:') ? response[i].srcImg[0] : ('/styles/imgs/products/' + response[i].srcImg[0])}" alt="product">
                        <div class="image-name">${response[i].title}</div>
                        <div class="price">${response[i].price}$</div>
                        <button class="wishlist-btn ${gFaveProductIds.includes(response[i]._id.toString()) ? 'wishlist-active' : ''}" onclick="toggleWishlist(event, this, '${response[i]._id}')">
                            <i class="${gFaveProductIds.includes(response[i]._id.toString()) ? 'bi bi-heart-fill' : 'bi bi-heart'}"></i>
                        </button>
                    </a>`
            }
        }

        $('#productsList').html(str) // Update product list display
    } catch (e) {
        console.log('Error:', e) // Log any errors
        $('#productsList').html('<p class="error-message">Error loading products. Please try again.</p>') // Show error message
    }
}

// Function to toggle wishlist status of a product
function toggleWishlist(event, button, productId) {
    event.preventDefault() // Prevent default action
    event.stopPropagation() // Stop event propagation

    const icon = button.querySelector('i')
    const isAdding = !icon.classList.contains('bi-heart-fill') // Determine if adding to wishlist

    $.ajax({
        url: `/products/toggle-wishlist`, // Endpoint to toggle wishlist
        method: 'POST', // HTTP method
        data: JSON.stringify({ productId, isAdding }), // Send product ID and action
        contentType: 'application/json', // Content type for JSON data
        success: function(response) {
            if (response.success) {
                icon.classList.toggle('bi-heart') // Toggle heart icon
                icon.classList.toggle('bi-heart-fill') // Toggle filled heart icon
                button.classList.toggle('wishlist-active') // Toggle wishlist button active state
                const message = isAdding ? 'Item successfully added to wishlist' : 'Item removed from wishlist'
                showNotice(message, false) // Show success notice
            } else {
                if (response.message) {
                    showNotice(response.message, false) // Show error message
                } else {
                    console.error('Error toggling wishlist:', response.error)
                    showNotice('Error: ' + response.error, false) // Show error message
                }
            }
        },
        error: function(error) {
            if (error.status === 401) {
                showNotice('In order to add to the wishlist, you have to log in', true) // Show login notice
            } else {
                console.error('Error toggling wishlist:', error)
                showNotice('Error: ' + error.responseText, false) // Show error message
            }
        }
    })
}

// Function to show notice modal with message
function showNotice(message, redirectToCart) {
    $('#noticeModalBody').text(message) // Update modal body with message
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {}) // Initialize modal
    noticeModal.show() // Show modal

    // Adding a delay before redirect or hiding modal
    setTimeout(function() {
        if (redirectToCart) {
            window.location.href = '/cart' // Redirect to cart page
        } else {
            noticeModal.hide() // Hide modal
        }
    }, 2000)
}