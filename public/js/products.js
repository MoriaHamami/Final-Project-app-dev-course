let gPrice = null
let gTitle = null
let gCat = null
let gSortIsAsc = {
    price: true,
    title: true

}
async function getProductsBy(sortVal = '', isAsc = true) {
    // gPrice = $('.products input[name="priceFilter"]').val()
    // gCat = $('.products input[name="catFilter"]').val()
    // gTitle = $('.products input[name="titleFilter"]').val()
    // console.log('price:', price)
    try {
        const products = await $.ajax({
            url: `/products/filter?filters[price]=${gPrice}&filters[title]=${gTitle}&filters[cat]=${gCat}&sort[sortVal]=${sortVal}&sort[isAsc]=${isAsc}`,
            method: 'GET',
            contentType: 'application/json',
        })
        // window.location.assign(`/products?filters[price]=${gPrice}&filters[title]=${gTitle}&filters[cat]=${gCat}`)
        let str = ''
        for (let i = 0; i < products.length; i++) {

            str += `<a class="image-container" href="/products/product/${products[i]._id}">
                <img src="${products[i].srcImg[0]?.includes('data:') ? products[i].srcImg[0] : ('/styles/imgs/products/' + products[i].srcImg[0])}"
                    alt="product">
                <div class="image-name">
                    ${products[i].title}
                </div>
                <div class="price">
                    ${products[i].price}$
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

function setCat() {
    gCat = $('.products select[name="catFilter"]').val()
    getProductsBy()
}

function setTitle() {
    gTitle = $('.products input[name="titleFilter"]').val()
    getProductsBy()
}

function setPrice() {
    gPrice = $('.products input[name="priceFilter"]').val()
    getProductsBy()
}

async function sortProductsBy(sortVal) {
    const capSortVal = sortVal.charAt(0).toUpperCase() + sortVal.slice(1)
    // console.log('sortVal.toUpperCase():', capSortVal)
    await getProductsBy(sortVal, gSortIsAsc[sortVal])
    gSortIsAsc[sortVal] = !gSortIsAsc[sortVal]
    $(`.products .sortBy${capSortVal}Btn`).html(`
    <i class="bi bi-caret-${gSortIsAsc[sortVal] ? 'up' : 'down'}"></i>
    Sort By ${capSortVal}
    `)

}
// async function sortProductsBy(sortVal){
//     try {
//         gSortAsc[sortVal] = !gSortAsc[sortVal]
//         const capSortVal = sortVal.charAt(0).toUpperCase() + sortVal.slice(1)
//         // console.log('sortVal.toUpperCase():', capSortVal)
//         $(`.products .sortBy${capSortVal}Btn`).html(`
//         <i class="bi bi-caret-${gSortAsc[sortVal] ? 'up' : 'down'}"></i>
//         Sort By ${capSortVal}
//         `)
//         const products = await $.ajax({
//             url: `/products/filter?filters[price]=${gPrice}&filters[title]=${gTitle}&filters[cat]=${gCat}`,
//             method: 'GET',
//             contentType: 'application/json',
//             data: JSON.stringify({ sort: sortVal, asc: gSortAsc[sortVal] })
//         })
//         // window.location.assign(`/products?filters[price]=${gPrice}&filters[title]=${gTitle}&filters[cat]=${gCat}`)
//         let str = ''
//         for(let i=0; i< products.length; i++) {

//             str += `<a class="image-container" href="/products/product/${ products[i]._id }">
//                 <img src="${ products[i].srcImg[0]?.includes('data:') ? products[i].srcImg[0] : ('/styles/imgs/products/' + products[i].srcImg[0])}"
//                     alt="product">
//                 <div class="image-name">
//                     ${ products[i].title }
//                 </div>
//                 <div class="price">
//                     ${ products[i].price }$
//                 </div>
//             </a>`

//             }
//             // console.log('str:', str)
//         $('.products #products').html(str)
//         // console.log('products.prodcuts[0]:', products)
//     } catch (e) {
//         console.log('e:', e)
//         // TODO: Later show an error modal
//     }
// }
