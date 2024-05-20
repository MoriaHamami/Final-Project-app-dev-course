// const title = ''
// const color = ''
// const cat = ''
// const srcImg = []
// const favePlayer = ''
// const price = 0
// const gender = ''
let gLastId = 0
async function addImg(input) {
    // TODO: DEAL WITH ADDING IMG TO EXISTING PRODUCT
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            ++gLastId
            // console.log('$(`.edit-product .srcImg#${input.id}`).attr:', $(`.edit-product .srcImg-${input.id}`).attr('src'))
            $(`.edit-product .edit-imgs li:last-child`).after(
                `<li>
                <img src="${e.target.result}" class="srcImg-${gLastId}">
                <input type="file" accept="image/*" name="srcImg"
                    src="${e.target.result}" id="${gLastId}">
                <button type="button" id=${gLastId} class="deleteImg">DELETE</button>
                </li>`
            )
            // $(
            //     `<li>
            //     <img src="${e.target.result}" class="srcImg-${++gLastId}">
            //     <input type="file" accept="image/*" name="srcImg"
            //         src="${e.target.result}" id="${++gLastId}">
            //     <button type="button">DELETE</button>
            //     </li>`
            // ).insertAfter(`.edit-product .srcImg-${gLastId-1}`)
            // .attr('src', e.target.result)
            // $(input).attr('src', e.target.result)
        }

        reader.readAsDataURL(input.files[0])
    }

}
async function deleteImg(id) {
    console.log('id:', id)
    $(`.edit-product li#${id}`).remove()

}




// async function updateImg(ev) {

//     try {
//         // const srcImg = 
//         const updatedProduct = await $.ajax({
//             url: '/products/edit',
//             method: 'PUT',
//             contentType: 'application/json',
//             data: JSON.stringify({
//                 srcImg
//             }),
//             // success: function(data) {
//             //     console.log('success --> data :', data);

//             //   },
//         })
//         console.log('redirect:', updatedProduct)
//         // window.location.assign('/products/product/' + updatedProduct._id)
//     } catch (e) {
//         console.log('e:', e)
//         // TODO: Later show an error modal
//     }


//     // ev.preventDefault()
//     console.log('ev:', ev)

// }

// const onChange = (newTitle, newColor, newCat, newSrcImg, newFavePlayer, newPrice, newGender) => {
//     title = newTitle
//     color = newColor
//     cat = newCat
//     srcImg = newSrcImg
//     favePlayer = newFavePlayer
//     price = newPrice
//     gender = newGender

// }

function readURL(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        console.log('input.id:', input.id)
        reader.onload = function (e) {
            // console.log('$(`.edit-product .srcImg#${input.id}`).attr:', $(`.edit-product .srcImg-${input.id}`).attr('src'))
            $(`.edit-product .srcImg-${input.id}`).attr('src', e.target.result)
            $(input).attr('src', e.target.result)
        }

        reader.readAsDataURL(input.files[0])
    }
}

$('.edit-product input[name="srcImg"]').change(function () {
    readURL(this)
})
$('.edit-product input[name="addImg"]').change(function () {
    addImg(this)
})
$('.edit-product .deleteImg').click(function () {
    const id = this.id
    deleteImg(id)
})



let gTitle = ''
let gColor = ''
let gFavePlayer = ''
let prigPricece = 0
let gSizes = []
let gSrcImg = []
$('#deleteButton').on('click', async function () {
    const id = $('#deleteButton').val()
    try {

        // const res =
        const res = await $.ajax({
            url: '/products/edit/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
        })
        window.location.assign('/products')

    } catch (e) {
        console.log('e:', e)
    }
})
$('#addButton').on('click', async function () {
    $('.edit-product input[name="srcImg"]').each(function () {
        // console.log('$(this).attr', $(this).attr('src'))
        if ($(this).attr('src').includes('data:')) {
            gSrcImg.push($(this).attr('src'))
        } else {
            const str = $(this).attr('src')
            const i = str.lastIndexOf('/')
            const res = str.substring(i + 1)
            gSrcImg.push(res)
            console.log('res:', res)
        }
        // gSrcImg.push($(this).attr('src'))
    })
    // console.log('gSrcImg:', gSrcImg)
    gTitle = $('.edit-product input[name="title"]').val()
    gColor = $('.edit-product input[name="color"]').val()
    gFavePlayer = $('.edit-product input[name="favePlayer"]').val()
    gPrice = $('.edit-product input[name="price"]').val()
    $('.edit-product input[name="sizes"]').each(function () {
        gSizes.push($(this).val())
    })
    try {
        const newProduct = await $.ajax({
            url: '/products/edit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                // _id: Number,
                title: gTitle,
                color: gColor,
                // cat,
                srcImg: gSrcImg,
                favePlayer: gFavePlayer,
                price: gPrice,
                // gender,
                // sizes

            }),
            // success: function(data) {
            //     console.log('success --> data :', data);

            //   },
        })
        window.location.assign('/products/product/' + newProduct._id)
    } catch (e) {
        console.log('e:', e)
        // TODO: Later show an error modal
    }
})
$('#updateButton').on('click', async function () {

    // $("form#editProduct :input").each(function () {
    //     // inputs.push( $(this)) // This is the jquery object of the input, do what you will
    //     switch ($(this).attr('name')) {
    //         case "title":
    //             gTitle = $(this).val()
    //             break;
    //         case "color":
    //             gColor = $(this).val()
    //             break;
    //         case "favePlayer":
    //             gFavePlayer = $(this).val()
    //             break;
    //         case "price":
    //             gPrice = $(this).val()
    //             break;
    //         case "sizes":
    //             $(this).each(function () {
    //                 gSizes.push($(this).val())
    //             })
    //             break;
    //         case "srcImg":
    //             $(this).each(function () {
    //                 gSrcImg.push($(this).attr('src'))
    //             })
    //             break;

    //     }
    // });
    // var rowEl = $(this).closest('article');

    gTitle = $('.edit-product input[name="title"]').val()
    gColor = $('.edit-product input[name="color"]').val()
    gFavePlayer = $('.edit-product input[name="favePlayer"]').val()
    gPrice = $('.edit-product input[name="price"]').val()
    $('.edit-product input[name="sizes"]').each(function () {
        gSizes.push($(this).val())
    })
    $('.edit-product input[name="srcImg"]').each(function () {
        // console.log('$(this).attr', $(this).attr('src'))
        console.log('this:', $(this).attr('src'))
        if ($(this).attr('src').includes('data:')) {
            gSrcImg.push($(this).attr('src'))
        } else {
            const str = $(this).attr('src')
            const i = str.lastIndexOf('/')
            const res = str.substring(i + 1)
            gSrcImg.push(res)
            console.log('res:', res)
        }
        // gSrcImg.push($(this).attr('src'))
    })

    // console.log('gImgSrc:', gSrcImg)
    console.log('gSrcImg:', gSrcImg)

    try {

        // const res =
        $.ajax({
            url: '/products/edit/' + $('#updateButton').val(),
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                // _id: Number,
                title: gTitle,
                color: gColor,
                // cat,
                srcImg: gSrcImg,
                favePlayer: gFavePlayer,
                price: gPrice,
                // gender,
                // sizes

            }),
            // success: function(data) {
            //     console.log('success --> data :', data);

            //   },
        })
        // console.log('res:', res)
        // return res

        // if (!res.ok) {
        //     console.log('Bad fetch response')
        //   }

        //   return await res.json()
    } catch (e) {
        console.log('e:', e)
    }


    // console.log('title:', title)
    // var rowEl = $(this).closest('article');
    // title = rowEl.find('.title').val();
    // color = rowEl.find('.color').val();
    // favePlayer = rowEl.find('.favePlayer').val();
    // price = rowEl.find('.price').val();
    // sizes = rowEl.find('.sizes').val();
    // imgSrc = rowEl.find('.imgSrc').val();
})

// USEFUL FROM WEB
// deleteUser = (id) => {
//     let url = `https://contact-browser.herokuapp.com/contact/${id}`;
//     fetch(url, { method: 'delete' }).then(resp => {
//         this.fetchData();
//     });
// };


const updateProduct = async (id) => {
    // try{
    //      await fetch('/products/edit/'+id, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             // _id: Number,
    //             title,
    //             color,
    //             // cat,
    //             // srcImg,
    //             favePlayer,
    //             price,
    //             // gender,
    //             // sizes
    //         })
    //     })
    // } catch(e){
    //     console.log('e:', e)
    // }
}