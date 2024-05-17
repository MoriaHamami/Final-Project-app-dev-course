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
let gTitle = ''
let gColor = ''
let gFavePlayer = ''
let prigPricece = 0
let gSizes = []
let gSrcImg = []
$('#updateButton').on('click', function () {

    // var rowEl = $(this).closest('article');
    gTitle = $('input[name="title"]').val()
    gColor = $('input[name="color"]').val()
    gFavePlayer = $('input[name="favePlayer"]').val()
    gPrice = $('input[name="price"]').val()
    $('input[name="sizes"]').each(function () {
        gSizes.push($(this).val())
    })
    $('input[name="srcImg"]').each(function () {
        gSrcImg.push($(this).attr('src'))
    })
    // console.log('gImgSrc:', gSrcImg)


    try {
        fetch('/products/edit/' + $('#updateButton').val(), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                // _id: Number,
                title: gTitle,
                color: gColor,
                // cat,
                // srcImg,
                favePlayer: gFavePlayer,
                price: gPrice,
                // gender,
                // sizes

            })
        }).then(data => {
            if (!data.ok) 
            console.log(data.status);
            else return data.json();
            })
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
    fetch(url, {method: 'delete'}).then(resp => {
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