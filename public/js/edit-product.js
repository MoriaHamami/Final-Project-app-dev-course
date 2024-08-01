// Global variables to keep track of input changes
let gTitle = '' // Product title
let gColor = '' // Product color
let gFavePlayer = '' // Favorite player
let gCat = '' // Product category
let gPrice = 0 // Product price
let gSizes = [] // Product sizes
let gSrcImgs = [] // Product image sources

// Initialize number of images and sizes from the DOM
let gNextImgIdx = $('.edit-product .edit-imgs li').length ? $('.edit-product .edit-imgs li').length + 2 : 1
let gNextSizeIdx = $('.edit-product .edit-sizes li').length ? $('.edit-product .edit-sizes li').length + 2 : 1
let gNumOfSizes = $('.edit-product .edit-sizes li').length || 0
let gNumOfImgs = $('.edit-product .edit-imgs li').length || 0

// Trigger file input when add image button is clicked
$('.add-img-btn').click(function () {
    $(".add-img-input").trigger('click') // Simulate click on file input
})

// Add event listeners for update buttons on existing images
for (let i = 0; i < gNumOfImgs; i++) {
    $(`.update-btn-${i}`).click(function () {
        $(`.update-img-${i}`).trigger('click') // Simulate click on file input
    })
}

// Function to update title value
function onChangeTitle(newTitle) {
    gTitle = newTitle // Update global title variable
}

// Function to update color value
function onChangeColor(newColor) {
    gColor = newColor // Update global color variable
}

// Function to update price value
function onChangePrice(newPrice) {
    gPrice = newPrice // Update global price variable
}

// Function to update favorite player value
function onChangeFavePlayer(newFavePlayer) {
    gFavePlayer = newFavePlayer // Update global favorite player variable
}

// Function to update category value
function onChangeCat(inputType) {
    if (inputType === "select") {
        const elSelect = $('.edit-product .edit-cat select')
        if (elSelect.find(":selected").val() === "other") {
            // Show input field if "other" is selected
            elSelect.after(`<input placeholder="Type a category for product" onchange="onChangeCat('input')">`)
            elSelect.hide()
        } else {
            // Update global category variable
            gCat = elSelect.find(":selected").val()
        }
    } else {
        const elInput = $('.edit-product .edit-cat input')
        gCat = elInput.val() // Update global category variable
    }
}

// Function to add image source to global array
function addTogSrcImgs(imgSrc) {
    if (imgSrc.includes('data:')) {
        gSrcImgs.push(imgSrc) // Add base64 image source
    } else {
        const str = imgSrc
        const i = str.lastIndexOf('/')
        const res = str.substring(i + 1)
        gSrcImgs.push(res) // Add image file name
    }
}

// Function to update global image source array from the DOM
function updateImgsSrc() {
    const imgs = $('.edit-product .edit-imgs li img')
    if (!imgs.length) return gSrcImgs = []
    imgs.each((_, img) => addTogSrcImgs(img.src)) // Add each image source to array
}

// Function to handle adding a new image
function onAddImg(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader()
        reader.readAsDataURL(input.files[0]) // Read file as base64
        reader.onload = function (e) {
            if (gNumOfImgs != 0) {
                const elLastImg = $('.edit-product .edit-imgs li:last-child')
                elLastImg.after(
                    `<li id="idx-${gNextImgIdx}">
                        <img src="${e.target.result}" class="srcImg-${gNextImgIdx}">
                        <input type="file" accept="image/*" name="srcImg" src="${e.target.result}" id="${gNextImgIdx}" onchange="onChangeImg(event.target)" class="update-img-${gNextImgIdx}">
                        </input>
                        <button type="button" class="update-btn-${gNextImgIdx}">Change</button>
                        <button type="button" id=${gNextImgIdx} class="deleteImg" onclick="onDeleteImg(${gNextImgIdx})">DELETE</button>
                    </li>`
                )
            } else {
                $('.edit-product .edit-imgs ul').append(
                    `<li id="idx-${gNextImgIdx}">
                        <img src="${e.target.result}" class="srcImg-${gNextImgIdx}">
                        <input type="file" accept="image/*" name="srcImg" onchange="onChangeImg(event.target)" src="${e.target.result}" id="${gNextImgIdx}" class="update-img-${gNextImgIdx}">
                        </input>
                        <button type="button" class="update-btn-${gNextImgIdx}">Change</button>
                        <button type="button" id=${gNextImgIdx} class="deleteImg" onclick="onDeleteImg(${gNextImgIdx})">DELETE</button>
                    </li>`
                )
            }
            addFileListener(gNextImgIdx) // Add listener for update button
            gNumOfImgs++
            gNextImgIdx++
        }
    }
}

// Function to add event listener for update button of a specific image
function addFileListener(id) {
    $(`.update-btn-${id}`).click(function () {
        $(`.update-img-${id}`).trigger('click') // Simulate click on file input
    })
}

// Function to handle updating an existing image
async function onChangeImg(input) {
    try {
        readChangedURL(input) // Update img tag after image change
    } catch (e) {
        console.log('Error:', e) // Log any errors
    }
}

// Function to handle deleting an image
function onDeleteImg(id) {
    gNumOfImgs--
    $(`.edit-product .edit-imgs li#idx-${id}`).remove() // Remove image from DOM
}

// Function to get image source from input data and update in DOM
async function readChangedURL(input) {
    if (input.files && input.files[0]) {
        return new Promise((res, rej) => {
            let reader = new FileReader()
            reader.readAsDataURL(input.files[0]) // Read file as base64
            reader.onload = function (e) {
                const imgUrl = e.target.result
                $(`.edit-product .srcImg-${input.id}`).attr('src', imgUrl) // Update image source in DOM
                $(input).attr('src', imgUrl) // Update input source attribute
                res(imgUrl) // Resolve promise with image URL
            }
        })
    }
}

// Function to handle adding a new size input
function onAddSize() {
    if (gNumOfSizes != 0) {
        const elLastSize = $('.edit-product .edit-sizes li:last-child')
        elLastSize.after(
            `<li id="idx-${gNextSizeIdx}">
                <input value="" name="sizes">
                <button type="button" onclick="onDeleteSize(${gNextSizeIdx})">
                    <i class="bi bi-trash"></i>
                </button>
            </li>`
        )
    } else {
        $('.edit-product .edit-sizes ul').append(
            `<li id="idx-1">
                <input value="S" name="sizes">
                <button type="button" onclick="onDeleteSize(1)"> 
                    <i class="bi bi-trash"></i>
                </button>
            </li>`
        )
    }
    ++gNextSizeIdx
    ++gNumOfSizes
}

// Function to update global sizes array from the DOM
function updateSizes() {
    const sizes = $('.edit-product .edit-sizes li input')
    if (!sizes.length) return gSizes = []
    sizes.each((_, size) => size.value ? gSizes.push(size.value) : '') // Add each size to array
}

// Function to handle deleting a size input
function onDeleteSize(id) {
    gNumOfSizes--
    $(`.edit-product .edit-sizes li#idx-${id}`).remove() // Remove size from DOM
}

// Function to handle adding a new product
async function onAddProduct(ev) {
    ev.preventDefault() // Prevent default form submission
    gSizes = []
    gSrcImgs = []
    updateImgsSrc() // Update global image source array
    updateSizes() // Update global sizes array

    try {
        const newProduct = await $.ajax({
            url: '/products/edit', // Endpoint to handle product addition
            method: 'POST', // HTTP method
            contentType: 'application/json', // Content type for JSON data
            data: JSON.stringify({
                title: gTitle, // Send product title
                color: gColor, // Send product color
                cat: gCat, // Send product category
                srcImg: gSrcImgs, // Send product images
                favePlayer: gFavePlayer, // Send favorite player
                price: gPrice, // Send product price
                sizes: gSizes // Send product sizes
            }),
        })
        showNotice('The product has been successfully added.', newProduct._id) // Show success notice
    } catch (e) {
        console.log('Error:', e) // Log any errors
    }
}

// Function to handle updating an existing product
async function onUpdateProduct(ev) {
    ev.preventDefault() // Prevent default form submission
    gSizes = []
    gSrcImgs = []
    updateImgsSrc() // Update global image source array
    updateSizes() // Update global sizes array

    try {
         $.ajax({
            url: '/products/edit/' + $('#updateButton').val(), // Endpoint to handle product update
            method: 'PUT', // HTTP method
            contentType: 'application/json', // Content type for JSON data
            data: JSON.stringify({
                title: gTitle, // Send product title
                color: gColor, // Send product color
                cat: gCat, // Send product category
                srcImg: gSrcImgs, // Send product images
                favePlayer: gFavePlayer, // Send favorite player
                price: gPrice, // Send product price
                sizes: gSizes // Send product sizes
            }),
        })
        showNotice('The product has been successfully updated.', $('#updateButton').val()) // Show success notice
    } catch (e) {
        console.log('Error:', e) // Log any errors
    }
}

// Function to handle deleting a product
async function onDeleteProduct(id) {
    try {
        const res = await $.ajax({
            url: '/products/edit/' + id, // Endpoint to handle product deletion
            method: 'DELETE', // HTTP method
            contentType: 'application/json', // Content type for JSON data
            data: JSON.stringify({ id }), // Send product ID
        })
        if (res.status !== 404) {
            window.location.assign('/products') // Redirect to products page
            showNotice('The product has been deleted.', false) // Show success notice
        }
    } catch (e) {
        console.log('Error:', e) // Log any errors
    }
}

// Function to display a notice modal with a message
function showNotice(message, productId) {
    $('#noticeModalBody').text(message) // Update modal body with message
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {}) // Initialize modal
    noticeModal.show() // Show modal

    // Adding a delay before redirect or hiding modal
    setTimeout(function () {
        if (productId) {
            window.location.href = `/products/product/${productId}` // Redirect to product page
        } else {
            noticeModal.hide() // Hide modal
        }
    }, 2000)
}
