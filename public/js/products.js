let gPrice = null
let gTitle = null
let gCat = null

async function getProductsByFilter(){
    // gPrice = $('.products input[name="priceFilter"]').val()
    // gCat = $('.products input[name="catFilter"]').val()
    // gTitle = $('.products input[name="titleFilter"]').val()
    // console.log('price:', price)
    try {
        const products = await $.ajax({
            url: `/products/filter?filters[price]=${gPrice}&filters[title]=${gTitle}&filters[cat]=${gCat}`,
            method: 'GET',
            contentType: 'application/json', 
        })
        // window.location.assign(`/products?filters[price]=${gPrice}&filters[title]=${gTitle}&filters[cat]=${gCat}`)
        let str = ''
        for(let i=0; i< products.length; i++) {

            str += `<a class="image-container" href="/products/product/${ products[i]._id }">
                <img src="${ products[i].srcImg[0]?.includes('data:') ? products[i].srcImg[0] : ('/styles/imgs/products/' + products[i].srcImg[0])}"
                    alt="product">
                <div class="image-name">
                    ${ products[i].title }
                </div>
                <div class="price">
                    ${ products[i].price }$
                </div>
            </a>`

            }
            // console.log('str:', str)
        $('.products #products').html(str)
        // console.log('products.prodcuts[0]:', products)
    } catch (e) {
        console.log('e:', e)
        // TODO: Later show an error modal
    }
}

$('.products input[name="priceFilter"]').change(function () {
    // getProductsByFilter()
    setPrice()
})
$('.products input[name="titleFilter"]').keyup(function () {
    setTitle()
})
$('.products select[name="catFilter"]').change(function () {
    setCat()
})

function setCat(){
        gCat = $('.products select[name="catFilter"]').val()
        getProductsByFilter()
}

function setTitle(){
    gTitle = $('.products input[name="titleFilter"]').val()
    getProductsByFilter()
}

function setPrice(){
    gPrice = $('.products input[name="priceFilter"]').val()
    getProductsByFilter()
}

