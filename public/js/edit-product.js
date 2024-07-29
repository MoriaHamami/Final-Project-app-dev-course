// Global variables to help us keep track of input changes
let gTitle = ''
let gColor = ''
let gFavePlayer = ''
let gCat = ''
let gPrice = 0
let gSizes = []
let gSrcImgs = []
// Initialize the amount of images according to the DOM
let gLastImgIdx = $('.edit-product .edit-imgs li').length ?  $('.edit-product .edit-imgs li').length + 2 : 1
let gLastSizeIdx = $('.edit-product .edit-sizes li').length ? $('.edit-product .edit-sizes li').length + 2 : 1
let gNumOfSizes = $('.edit-product .edit-sizes li').length || 0
let gNumOfImgs = $('.edit-product .edit-imgs li').length || 0

// Functions to update global vars when changes occur in inputs
function onChangeTitle(newTitle) {
    gTitle = newTitle
}
function onChangeColor(newColor) {
    gColor = newColor
}
function onChangePrice(newPrice) {
    gPrice = newPrice
}
function onChangeFavePlayer(newFavePlayer) {
    gFavePlayer = newFavePlayer
}
function onChangeCat(inputType) {
    if(inputType === "select"){
        const elSelect = $('.edit-product .edit-cat select')
        if(elSelect.find(":selected").val() === "other") {
            elSelect.after(`<input placeholder="Type a category for product" onchange="onChangeCat('input')">`)
            elSelect.hide()
        }else{
            gCat = elSelect.find(":selected").val()
        }
    }else{
        const elInput = $('.edit-product .edit-cat input')
        gCat = elInput.val()
    }
}
function addTogSrcImgs(imgSrc) {
    if (imgSrc.includes('data:')) {
        // If the image was uploaded just add its source to the global srcImg array 
        gSrcImgs.push(imgSrc)
    } else {
        // If the image is from a local path, get the file name saved localy (example: ".../fileName.jpeg" -> get "fileName.jpeg")
        // Save a temp var
        const str = imgSrc
        // Get the index where the last "/" is in the img path
        const i = str.lastIndexOf('/')
        // get a substring from right after the first slash, until the end of the string
        const res = str.substring(i + 1)
        // Add the file name to the global srcImg array 
        gSrcImgs.push(res)
    }
}
function updateImgsSrc() {
    // Get all the imgs in DOM
    const imgs = $('.edit-product .edit-imgs li img')
    if (!imgs) return gSrcImgs = []
    else imgs.map((_, { src }) => addTogSrcImgs(src)) // extract src and add to gSrcImgs var
}

function onAddImg(input) {
    // Check if file is recieved
    if (input.files && input.files[0]) {
        // The FileReader object enables to read the content of a file and use readAsDataURL
        let reader = new FileReader()
        // Reading the file
        reader.readAsDataURL(input.files[0])
        // Onload is triggered when the reading successfully ends
        reader.onload = function (e) {
            if (gNumOfImgs != 0) {
                // If there are other images, add the image in DOM after the last image
                const elLastImg = $('.edit-product .edit-imgs li:last-child')
                elLastImg.after(
                    `<li id="${gLastImgIdx}">
                 <img src="${e.target.result}" class="srcImg-${gLastImgIdx}">
                 <input type="file" accept="image/*" name="srcImg"
                     src="${e.target.result}" id="${gLastImgIdx}" onchange="onChangeImg(event.target)">
                     <button type="button" id=${gLastImgIdx} class="deleteImg" onclick="onDeleteImg(${gLastImgIdx})">DELETE</button>
                     </li>`
                )
            } else {
                // If there are no images, add the image in DOM inside ul
                $('.edit-product .edit-imgs ul').append(
                    `<li id="1">
                 <img src="${e.target.result}" class="srcImg-1">
                 <input type="file" accept="image/*" name="srcImg"
                     src="${e.target.result}" id="1" onchange="onChangeImg(event.target)">
                 <button type="button" id=0 class="deleteImg" onclick="onDeleteImg(1)">DELETE</button>
                 </li>`
                )
            }
            // Update local var
            ++gLastImgIdx
            ++gNumOfImgs
        }
    }
}
async function onChangeImg(input) {
    try {
        // Load, view and get the image  
        const imgSrc = await readChangedURL(input)
        addTogSrcImgs(imgSrc)
    } catch (e) {
        console.log('e:', e)
    }
}
function onDeleteImg(id) {
    
    // Update local var
    gNumOfImgs--
    // Remove from DOM the image selected to be deleted
    $(`.edit-product .edit-imgs li#${id}`).remove()
}
// Get img source from data recieved in input and update in DOM
async function readChangedURL(input) {
    // Check if file is recieved
    if (input.files && input.files[0]) {
        // Return a promise to indicate when the image has loaded 
        return new Promise((res, rej) => {
            // The FileReader object enables to read the content of a file and use readAsDataURL
            let reader = new FileReader()
            // Reading the file
            reader.readAsDataURL(input.files[0])
            // Onload is triggered when the reading successfully ends
            reader.onload = function (e) {
                const imgUrl = e.target.result
                // View the loaded image in the img elemnt
                $(`.edit-product .srcImg-${input.id}`).attr('src', imgUrl)
                // Update the src attribute in the input accordingly
                $(input).attr('src', imgUrl)
                // Return the image source
                return res(imgUrl)
            }
        })
    }
}

function onAddSize() {
    console.log('gNumOfSizes:', gNumOfSizes)
    if (gNumOfSizes != 0) {
        // If there are other sizes, add size input section in DOM after the last input
        const elLastSize = $('.edit-product .edit-sizes li:last-child')
        elLastSize.after(
            `<li id=${gLastSizeIdx}>
                <input value="" name="sizes">
                <button type="button" onclick="onDeleteSize(${gLastSizeIdx})">
                    <i class="bi bi-trash"></i>
                </button>
            </li>`
        )
    } else {
        // If there are no sizes, add the size in DOM inside ul
        $('.edit-product .edit-sizes ul').append(
            `<li id="1">
                <input value="S" name="sizes">
                <button type="button" onclick="onDeleteSize(1)"> 
                    <i class="bi bi-trash"></i>
                </button>
            </li>`
        )
    }
    // Update local var
    ++gLastSizeIdx
    ++gNumOfSizes
    
}
function updateSizes() {
    // Get all the sizes in DOM
    const sizes = $('.edit-product .edit-sizes li input')
    if (!sizes) return gSizes = []
    else sizes.map((_, { value }) => value ? gSizes.push(value) : '') // extract values and add to gSizes var
    console.log('gSizes:', gSizes)
}
function onDeleteSize(id) {
    console.log('id:', id)
    // Update local var
    gNumOfSizes--
    console.log('gNumOfSizes:', gNumOfSizes)
    // Remove from DOM the size selected to be deleted
    $(`.edit-product .edit-sizes li#${id}`).remove()
}






async function onAddProduct(ev) {
    // Prevent refresh after the user submits the form
    ev.preventDefault()
    // TODO: Deal with sizes, gender and category
    // $('.edit-product input[name="sizes"]').each(function () {
    //     gSizes.push($(this).val())
    // })
    updateImgsSrc()
    updateSizes()

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
                // gender,
                sizes: gSizes
            }),
        })
        // Leave edit mode and show the product page 
        window.location.assign('/products/product/' + newProduct._id)
    } catch (e) {
        console.log('e:', e)
        // TODO: Later show an error modal
    }
}
async function onUpdateProduct(ev) {
    // Prevent refresh after the user submits the form
    ev.preventDefault()

    // TODO: Deal with sizes, gender and category
    // $('.edit-product input[name="sizes"]').each(function () {
    //     gSizes.push($(this).val())
    // })

    updateImgsSrc()
updateSizes()

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
                // gender,
                sizes: gSizes
            }),
        })

        // TODO: Add success message
             // Leave edit mode and show the product page 
             window.location.assign('/products/product/' + $('#updateButton').val())

    } catch (e) {
        console.log('e:', e)
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
        })
        if (res.status !== 404) window.location.assign('/products')
    } catch (e) {
        console.log('e:', e)
    }
}












