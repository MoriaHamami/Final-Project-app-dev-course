// Global variables for updating use
let gPrice = 0
let gTitle = ''
let gCat = ''
let gSortIsAsc = {
    price: true,
    title: true
}



// Update the values of the global variables according to the changes in the input
function setCat(newCat) {
    gCat = newCat
    getProductsBy()
}
function setTitle(newTitle) {
    gTitle = newTitle
    getProductsBy()
}
function setPrice(newPrice) {
    gPrice = newPrice
    getProductsBy()
}

// When clicking on the sort buttons, do the following:
async function sortProductsBy(sortVal) {
    try {
        // Send the sort value (price or title) and if we want the sort to ascend or descend
        await getProductsBy(sortVal, gSortIsAsc[sortVal])
        // After the products are sorted and shown, change the isAsc value for next time use
        gSortIsAsc[sortVal] = !gSortIsAsc[sortVal]
        // Save a capitalized version of the sort value
        const capSortVal = sortVal.charAt(0).toUpperCase() + sortVal.slice(1)
        // Change the icon showing the ascend and descend direction in sort button
        $(`.products .sortBy${capSortVal}Btn`).html(`
        <i class="bi bi-caret-${gSortIsAsc[sortVal] ? 'up' : 'down'}"></i>
        Sort By ${capSortVal}
        `)
    } catch (e) {
        console.log('Products were not sorted succesfully')
    }
}

async function getProductsBy(sortVal = '', isAsc = true) {
    try {
        // Send a get request with the param and sort values from the updated global variables
        const products = await $.ajax({
            url: `/products/filter?filters[price]=${gPrice}&filters[title]=${gTitle}&filters[cat]=${gCat}&sort[sortVal]=${sortVal}&sort[isAsc]=${isAsc}`,
            method: 'GET',
            contentType: 'application/json',
        })
        // Create a long string that represents the HTML of products we want to be shown after we got the products from the DB (filtered and sorted)
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
                 </a >`

        }
        // Inside the products area in the HTML, show all the products
        $('.products #productsList').html(str)
    } catch (e) {
        console.log('e:', e)
        // TODO: Later show an error modal
    }
}
