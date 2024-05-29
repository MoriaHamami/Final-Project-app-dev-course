// Global variables to help us keep track of input changes
let gTitle = ''
let gColor = ''
let gFavePlayer = ''
let gPrice = 0
let gSizes = []
let gSrcImg = []
let gNumOfImgs = 0

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

function onAddImg(input) {
    // TODO: DEAL WITH ADDING IMG TO EXISTING PRODUCT
    // Check if file is recieved
    if (input.files && input.files[0]) {
        // The FileReader object enables to read the content of a file and use readAsDataURL
        let reader = new FileReader()
        // Reading the file
        reader.readAsDataURL(input.files[0])
        // Onload is triggered when the reading successfully ends
        reader.onload = function (e) {
            // Update local var
            ++gNumOfImgs
            if (gNumOfImgs != 0) {
                // If there are other images, add the image in DOM after the last image
                const elLastImg = $('.edit-product .edit-imgs li:last-child')
                elLastImg.after(
                    `<li id="${gNumOfImgs}">
                 <img src="${e.target.result}" class="srcImg-${gNumOfImgs}">
                 <input type="file" accept="image/*" name="srcImg"
                     src="${e.target.result}" id="${gNumOfImgs}" onchange="onChangeImg(event.target)">
                     <button type="button" id=${gNumOfImgs} class="deleteImg" onclick="onDeleteImg(${gNumOfImgs})">DELETE</button>
                     </li>`
                )
            } else {
                // If there are no images, add the image in DOM inside ul
                $('.edit-product .edit-imgs ul').append(
                    `<li id="0">
                 <img src="${e.target.result}" class="srcImg-0">
                 <input type="file" accept="image/*" name="srcImg"
                     src="${e.target.result}" id="0" onchange="onChangeImg(event.target)">
                 <button type="button" id=0 class="deleteImg" onclick="onDeleteImg(0)">DELETE</button>
                 </li>`
                )
            }
        }
    }
}
async function onChangeImg(input) {
    try {
        // Load, view and get the image  
        const imgSrc = await readChangedURL(input)
        if (imgSrc.includes('data:')) {
            // If the image was uploaded just add its source to the global srcImg array 
            gSrcImg.push(imgSrc)
        } else {
            // If the image is from a local path, get the file name saved localy (example: ".../fileName.jpeg" -> get "fileName.jpeg")
            // Save a temp var
            const str = imgSrc
            // Get the index where the last "/" is in the img path
            const i = str.lastIndexOf('/')
            // get a substring from right after the first slash, until the end of the string
            const res = str.substring(i + 1)
            // Add the file name to the global srcImg array 
            gSrcImg.push(res)
        }
    } catch (e) {
        console.log('e:', e)
    }
}
function onDeleteImg(id) {
    // Update local var
    gNumOfImgs--
    // Remove from DOM the image selected to be deleted
    $(`.edit-product li#${id}`).remove()
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


async function onAddProduct(ev) {
    // Prevent refresh after the user submits the form
    ev.preventDefault()

    // TODO: Deal with sizes, gender and category
    // $('.edit-product input[name="sizes"]').each(function () {
    //     gSizes.push($(this).val())
    // })

    try {
        // Send a post request using ajax, and send on the body the data from the form
        const newProduct = await $.ajax({
            url: '/products/edit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                title: gTitle,
                color: gColor,
                // cat,
                srcImg: gSrcImg,
                favePlayer: gFavePlayer,
                price: gPrice,
                // gender,
                // sizes
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

    try {
        // Send a put (update) request using ajax, and send on the body the data from the form
        await $.ajax({
            url: '/products/edit/' + $('#updateButton').val(),
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                title: gTitle,
                color: gColor,
                // cat,
                srcImg: gSrcImg,
                favePlayer: gFavePlayer,
                price: gPrice,
                // gender,
                // sizes
            }),
        })

        // TODO: Add success message

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










