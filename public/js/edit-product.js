// const title = ''
// const color = ''
// const cat = ''
// const srcImg = []
// const favePlayer = ''
// const price = 0
// const gender = ''
function addImg() {

}
function updateImg(ev) {
    // ev.preventDefault()
    console.log('ev:', ev)

}

const addProduct = (title, color, cat, srcImg, favePlayer, price, gender) => {
    try {

        fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // _id: Number,
                title,
                color,
                cat,
                srcImg,
                favePlayer,
                price,
                gender
            })
        })
    } catch (e) {
        console.log('e:', e)
    }
}

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
        // console.log('input.id:', input.id)
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



let gTitle = ''
let gColor = ''
let gFavePlayer = ''
let prigPricece = 0
let gSizes = []
let gSrcImg = []
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
deleteUser = (id) => {
    let url = `https://contact-browser.herokuapp.com/contact/${id}`;
    fetch(url, { method: 'delete' }).then(resp => {
        this.fetchData();
    });
};


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