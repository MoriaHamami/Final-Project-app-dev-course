// Global variables to help us keep track of input changes
let gTitle = '';
let gColor = '';
let gFavePlayer = '';
let gCat = '';
let gPrice = 0;
let gSizes = [];
let gSrcImgs = [];
// Initialize the amount of images according to the DOM
let gNumOfImgs = $('.edit-product .edit-imgs li').length || 0;
let gNumOfSizes = $('.edit-product .edit-sizes li').length || 0;

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
    if(inputType === "select"){
        const elSelect = $('.edit-product .edit-cat select');
        if(elSelect.find(":selected").val() === "other") {
            elSelect.after(`<input placeholder="Type a category for product" class="form-control mt-2" onchange="onChangeCat('input')">`);
            elSelect.hide();
        } else {
            gCat = elSelect.find(":selected").val();
        }
    } else {
        const elInput = $('.edit-product .edit-cat input');
        gCat = elInput.val();
    }
}
function addTogSrcImgs(imgSrc) {
    if (imgSrc.includes('data:')) {
        // If the image was uploaded just add its source to the global srcImg array 
        gSrcImgs.push(imgSrc);
    } else {
        // If the image is from a local path, get the file name saved locally (example: ".../fileName.jpeg" -> get "fileName.jpeg")
        // Save a temp var
        const str = imgSrc;
        // Get the index where the last "/" is in the img path
        const i = str.lastIndexOf('/');
        // get a substring from right after the first slash, until the end of the string
        const res = str.substring(i + 1);
        // Add the file name to the global srcImg array 
        gSrcImgs.push(res);
    }
}
function updateImgsSrc() {
    // Get all the imgs in DOM
    const imgs = $('.edit-product .edit-imgs li img');
    if (!imgs) return gSrcImgs = [];
    else imgs.each((_, { src }) => addTogSrcImgs(src)); // extract src and add to gSrcImgs var
}

function onAddImg(input) {
    // Check if file is received
    if (input.files && input.files[0]) {
        // The FileReader object enables to read the content of a file and use readAsDataURL
        let reader = new FileReader();
        // Reading the file
        reader.readAsDataURL(input.files[0]);
        // Onload is triggered when the reading successfully ends
        reader.onload = function (e) {
            if (gNumOfImgs != 0) {
                // If there are other images, add the image in DOM after the last image
                const elLastImg = $('.edit-product .edit-imgs li:last-child');
                elLastImg.after(
                    `<li id="${gNumOfImgs}">
                        <img src="${e.target.result}" class="srcImg-${gNumOfImgs} img-thumbnail">
                        <input type="file" accept="image/*" name="srcImg"
                            src="${e.target.result}" id="${gNumOfImgs}" onchange="onChangeImg(event.target)" class="form-control mt-2">
                        <button type="button" id=${gNumOfImgs} class="btn btn-danger btn-sm mt-2 deleteImg" onclick="onDeleteImg(${gNumOfImgs})">DELETE</button>
                    </li>`
                );
            } else {
                // If there are no images, add the image in DOM inside ul
                $('.edit-product .edit-imgs ul').append(
                    `<li id="0">
                        <img src="${e.target.result}" class="srcImg-0 img-thumbnail">
                        <input type="file" accept="image/*" name="srcImg"
                            src="${e.target.result}" id="0" onchange="onChangeImg(event.target)" class="form-control mt-2">
                        <button type="button" id=0 class="btn btn-danger btn-sm mt-2 deleteImg" onclick="onDeleteImg(0)">DELETE</button>
                    </li>`
                );
            }
            // Update local var
            ++gNumOfImgs;
        }
    }
}
async function onChangeImg(input) {
    try {
        // Load, view and get the image  
        const imgSrc = await readChangedURL(input);
        addTogSrcImgs(imgSrc);
    } catch (e) {
        console.log('e:', e);
    }
}
function onDeleteImg(id) {
    // Update local var
    gNumOfImgs--;
    // Remove from DOM the image selected to be deleted
    $(`.edit-product .edit-imgs li#${id}`).remove();
}
// Get img source from data received in input and update in DOM
async function readChangedURL(input) {
    // Check if file is received
    if (input.files && input.files[0]) {
        // Return a promise to indicate when the image has loaded 
        return new Promise((res, rej) => {
            // The FileReader object enables to read the content of a file and use readAsDataURL
            let reader = new FileReader();
            // Reading the file
            reader.readAsDataURL(input.files[0]);
            // Onload is triggered when the reading successfully ends
            reader.onload = function (e) {
                const imgUrl = e.target.result;
                // View the loaded image in the img element
                $(`.edit-product .srcImg-${input.id}`).attr('src', imgUrl);
                // Update the src attribute in the input accordingly
                $(input).attr('src', imgUrl);
                // Return the image source
                return res(imgUrl);
            }
        });
    }
}

function onAddSize() {
    if (gNumOfSizes != 0) {
        // If there are other sizes, add size input section in DOM after the last input
        const elLastSize = $('.edit-product .edit-sizes ul');
        elLastSize.append(
            `<li id=${gNumOfSizes} class="d-flex align-items-center mb-2">
                <input value="" name="sizes" class="form-control me-2" onchange="onChangeSize(event.target.value, '${gNumOfSizes}')">
                <button type="button" class="btn btn-danger btn-sm" onclick="onDeleteSize(${gNumOfSizes})"><i class="bi bi-trash"></i></button>
            </li>`
        );
    } else {
        // If there are no sizes, add the size in DOM inside ul
        $('.edit-product .edit-sizes ul').append(
            `<li id="0" class="d-flex align-items-center mb-2">
                <input value="S" name="sizes" class="form-control me-2" onchange="onChangeSize(event.target.value, '0')">
                <button type="button" class="btn btn-danger btn-sm" onclick="onDeleteSize(0)"><i class="bi bi-trash"></i></button>
            </li>`
        );
    }
    // Update local var
    ++gNumOfSizes;
    updateSizes();
}

function updateSizes() {
    // Get all the sizes in DOM
    const sizes = $('.edit-product .edit-sizes li input');
    if (!sizes) return gSizes = [];
    else {
        gSizes = [];
        sizes.each((_, { value }) => value ? gSizes.push(value) : '');
    } // extract values and add to gSizes var
}

function onChangeSize(newSize, id) {
    $(`.edit-product .edit-sizes li#${id} input`).val(newSize);
    updateSizes();
}

function onDeleteSize(id) {
    // Update local var
    gNumOfSizes--;
    // Remove from DOM the size selected to be deleted
    $(`.edit-product .edit-sizes li#${id}`).remove();
    updateSizes();
}

async function onAddProduct(ev) {
    // Prevent refresh after the user submits the form
    ev.preventDefault();

    updateImgsSrc();
    updateSizes();

    try {
        // Send a post request using ajax, and send on the body the data from the form
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
        // Leave edit mode and show the product page 
        window.location.assign('/products/product/' + newProduct._id);
    } catch (e) {
        console.log('e:', e);
    }
}
async function onUpdateProduct(ev) {
    // Prevent refresh after the user submits the form
    ev.preventDefault();

    updateImgsSrc();
    updateSizes();

    try {
        // Send a put (update) request using ajax, and send on the body the data from the form
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

    } catch (e) {
        console.log('e:', e);
    }
}

async function onDeleteProduct(id) {
    try {
        // Send a delete request using ajax, and send on the body the id of the product to delete
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
