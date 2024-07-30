// Global variables to help us keep track of input changes
let gTitle = '';
let gColor = '';
let gFavePlayer = '';
let gCat = '';
let gPrice = 0;
let gSizes = [];
let gSrcImgs = [];
// Initialize the number of images and sizes according to the DOM
let gNextImgIdx = $('.edit-product .edit-imgs li').length ? $('.edit-product .edit-imgs li').length + 2 : 1;
let gNextSizeIdx = $('.edit-product .edit-sizes li').length ? $('.edit-product .edit-sizes li').length + 2 : 1;
let gNumOfSizes = $('.edit-product .edit-sizes li').length || 0;
let gNumOfImgs = $('.edit-product .edit-imgs li').length || 0;

// Trigger file input when the add image button is clicked
$('.add-img-btn').click(function () {
    $(".add-img-input").trigger('click');
});

// Add event listeners for update buttons on existing images
for (let i = 0; i < gNumOfImgs; i++) {
    $(`.update-btn-${i}`).click(function () {
        $(`.update-img-${i}`).trigger('click');
    });
}

// Functions to update global vars when changes occur in inputs
function onChangeTitle(newTitle) {
    gTitle = newTitle;
}

function onChangeColor(newColor) {
    gColor = newColor;
}

function onChangePrice(newPrice) {
    gPrice = newPrice;
}

function onChangeFavePlayer(newFavePlayer) {
    gFavePlayer = newFavePlayer;
}

function onChangeCat(inputType) {
    if (inputType === "select") {
        const elSelect = $('.edit-product .edit-cat select');
        if (elSelect.find(":selected").val() === "other") {
            elSelect.after(`<input placeholder="Type a category for product" onchange="onChangeCat('input')">`);
            elSelect.hide();
        } else {
            gCat = elSelect.find(":selected").val();
        }
    } else {
        const elInput = $('.edit-product .edit-cat input');
        gCat = elInput.val();
    }
}

// Add image source to global array
function addTogSrcImgs(imgSrc) {
    if (imgSrc.includes('data:')) {
        gSrcImgs.push(imgSrc);
    } else {
        const str = imgSrc;
        const i = str.lastIndexOf('/');
        const res = str.substring(i + 1);
        gSrcImgs.push(res);
    }
}

// Update global image source array with images from the DOM
function updateImgsSrc() {
    const imgs = $('.edit-product .edit-imgs li img');
    if (!imgs.length) return gSrcImgs = [];
    imgs.each((_, img) => addTogSrcImgs(img.src));
}

// Handle adding a new image
function onAddImg(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = function (e) {
            if (gNumOfImgs != 0) {
                const elLastImg = $('.edit-product .edit-imgs li:last-child');
                elLastImg.after(
                    `<li id="idx-${gNextImgIdx}">
                        <img src="${e.target.result}" class="srcImg-${gNextImgIdx}">
                        <input type="file" accept="image/*" name="srcImg" src="${e.target.result}" id="${gNextImgIdx}" onchange="onChangeImg(event.target)" class="update-img-${gNextImgIdx}">
                        </input>
                        <button type="button" class="update-btn-${gNextImgIdx}">Change</button>
                        <button type="button" id=${gNextImgIdx} class="deleteImg" onclick="onDeleteImg(${gNextImgIdx})">DELETE</button>
                    </li>`
                );
            } else {
                $('.edit-product .edit-imgs ul').append(
                    `<li id="idx-${gNextImgIdx}">
                        <img src="${e.target.result}" class="srcImg-${gNextImgIdx}">
                        <input type="file" accept="image/*" name="srcImg" onchange="onChangeImg(event.target)" src="${e.target.result}" id="${gNextImgIdx}" class="update-img-${gNextImgIdx}">
                        </input>
                        <button type="button" class="update-btn-${gNextImgIdx}">Change</button>
                        <button type="button" id=${gNextImgIdx} class="deleteImg" onclick="onDeleteImg(${gNextImgIdx})">DELETE</button>
                    </li>`
                );
            }
            addFileListener(gNextImgIdx);
            gNumOfImgs++;
            gNextImgIdx++;
        }
    }
}

// Add event listener for the update button of a specific image
function addFileListener(id) {
    $(`.update-btn-${id}`).click(function () {
        $(`.update-img-${id}`).trigger('click');
    });
}

// Handle updating an existing image
async function onChangeImg(input) {
    try {
        const imgSrc = await readChangedURL(input);
        addTogSrcImgs(imgSrc);
    } catch (e) {
        console.log('e:', e);
    }
}

// Handle deleting an image
function onDeleteImg(id) {
    gNumOfImgs--;
    $(`.edit-product .edit-imgs li#idx-${id}`).remove();
}

// Get img source from data received in input and update in DOM
async function readChangedURL(input) {
    if (input.files && input.files[0]) {
        return new Promise((res, rej) => {
            let reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = function (e) {
                const imgUrl = e.target.result;
                $(`.edit-product .srcImg-${input.id}`).attr('src', imgUrl);
                $(input).attr('src', imgUrl);
                res(imgUrl);
            }
        });
    }
}

// Handle adding a new size input
function onAddSize() {
    if (gNumOfSizes != 0) {
        const elLastSize = $('.edit-product .edit-sizes li:last-child');
        elLastSize.after(
            `<li id="idx-${gNextSizeIdx}">
                <input value="" name="sizes">
                <button type="button" onclick="onDeleteSize(${gNextSizeIdx})">
                    <i class="bi bi-trash"></i>
                </button>
            </li>`
        );
    } else {
        $('.edit-product .edit-sizes ul').append(
            `<li id="idx-1">
                <input value="S" name="sizes">
                <button type="button" onclick="onDeleteSize(1)"> 
                    <i class="bi bi-trash"></i>
                </button>
            </li>`
        );
    }
    ++gNextSizeIdx;
    ++gNumOfSizes;
}

// Update global sizes array with sizes from the DOM
function updateSizes() {
    const sizes = $('.edit-product .edit-sizes li input');
    if (!sizes.length) return gSizes = [];
    sizes.each((_, size) => size.value ? gSizes.push(size.value) : '');
}

// Handle deleting a size input
function onDeleteSize(id) {
    gNumOfSizes--;
    $(`.edit-product .edit-sizes li#idx-${id}`).remove();
}

// Handle adding a new product
async function onAddProduct(ev) {
    ev.preventDefault();
    gSizes = [];
    gSrcImgs = [];
    updateImgsSrc();
    updateSizes();

    try {
        const newProduct = await $.ajax({
            url: '/products/edit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                title: gTitle,
                color: gColor,
                cat: gCat,
                srcImg: gSrcImgs,
                favePlayer: gFavePlayer,
                price: gPrice,
                sizes: gSizes
            }),
        });
        // Trigger the modal
        showNotice('The product has been successfully added.', true);
    } catch (e) {
        console.log('e:', e);
        // TODO: Later show an error modal
    }
}

// Handle updating an existing product
async function onUpdateProduct(ev) {
    ev.preventDefault();
    gSizes = [];
    gSrcImgs = [];
    updateImgsSrc();
    updateSizes();

    try {
        await $.ajax({
            url: '/products/edit/' + $('#updateButton').val(),
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                title: gTitle,
                color: gColor,
                cat: gCat,
                srcImg: gSrcImgs,
                favePlayer: gFavePlayer,
                price: gPrice,
                sizes: gSizes
            }),
        });

        // Show success message
        showNotice('The product has been successfully updated.', false);
    } catch (e) {
        console.log('e:', e);
    }
}

// Handle deleting a product
async function onDeleteProduct(id) {
    try {
        const res = await $.ajax({
            url: '/products/edit/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
        });
        if (res.status !== 404) window.location.assign('/products');
    } catch (e) {
        console.log('e:', e);
    }
}

// Display a notice modal with a message
function showNotice(message, redirectToCart) {
    $('#noticeModalBody').text(message);
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {});
    noticeModal.show();

    // Adding a delay before redirect or hiding modal
    setTimeout(function () {
        if (redirectToCart) {
            window.location.href = '/cart'; // Redirect to the cart page after 2 seconds
        } else {
            noticeModal.hide(); // Hide modal and stay on the same page
        }
    }, 2000);
}
