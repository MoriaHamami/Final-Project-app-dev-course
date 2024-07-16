const Product = require('../models/products');

const createProduct = async (title = "", color = "", cat = "", price = 0, gender = "", favePlayer = "", srcImg = [], sizes = [], toDisplay=true) => {
    // Product.init() // Document gets generated (and gets an id)
    // console.log('srcImg:', srcImg)
    const product = new Product({
        title,
        color,
        cat,
        srcImg,
        favePlayer,
        price,
        gender,
        sizes,
        toDisplay
    })
    // console.log('product:', product)
    try {
        return await product.save()
    } catch (e) {
        return e
    }
}

const getDistinctCats = async () => {
    try {
        return await Product.find({}).distinct("cat")
        
    } catch (e) {
        console.log('e:', e)
    }
}
async function getProductById(id) {
    try {
        const product = await Product.findById(id);
        return product;
    } catch (e) {
        console.error('Error fetching product by ID:', e);
        throw e;
    }
}

const getProducts = async (priceFilter = '', titleFilter = '', catFilter = '', sortVal = '', isAsc) => {
    // try{

    // }catch(e){

    // }
    const filter = {toDisplay: { $ne: false }}
    if (priceFilter && priceFilter != "null" && priceFilter > 0) {
        filter.price = { $lt: priceFilter }
    }
    if (titleFilter && titleFilter != "null") {
        filter.title = new RegExp(titleFilter, 'i')
    }
    if (catFilter && catFilter != "null") {
        filter.cat = { $in: catFilter }
    }
    // console.log('filter:', filter)
    let products = []
    if (sortVal && sortVal != "null") {

        isAsc = isAsc == "true" ? 1 : -1
        const sortObj = {}
        sortObj[sortVal] = isAsc
        products = await Product.find(filter).sort(sortObj)
    } else {
        products = await Product.find(filter)
    }
    // console.log('products:', products)
    // if (priceFilter) {
    //     await products?.where('price').lt(priceFilter)
    // }
    // if (titleFilter) {
    //     const regex= new RegExp(titleFilter, 'i')
    //     await products?.where("title").regex(regex)
    // }
    // if (catFilter?.length > 0) {
    //     await products?.where('cat').in(catFilter)
    // }
    // const products = await Product.find({ "price": priceFilter, "title": titleFilter, "cat": catFilter})

    // Get maxPrice, minPrice and categories for filter options in page
    // const maxPrice = await Product.find({}).max("price")
    const productMaxPrice = await Product.find({}).sort({ "price": -1 }).limit(1)
    const maxPrice = productMaxPrice ? productMaxPrice[0].price : 10000
    // console.log('maxPrice:', maxPrice)
    const productMinPrice = await Product.find({}).sort({ "price": 1 }).limit(1)
    const minPrice = productMinPrice ? productMinPrice[0].price : 0
    // console.log('minPrice:', minPrice)
    const cat = await getDistinctCats()
    // console.log('cat:', cat)
    const res = { maxPrice, minPrice, cat, products }
    return res
}

const updateProduct = async (id, title = "", color = "", cat = "", price = 0, gender = "", favePlayer = "", srcImg = [], sizes = [], toDisplay=true) => {
    const product = await getProductById(id)
    // console.log('here:', product)
    if (!product)
        return null
    if (title) product.title = title
    if (color) product.color = color
    if (price) product.price = price
    if (gender) product.gender = gender
    if (cat) product.cat = cat
    if (favePlayer) product.favePlayer = favePlayer
    if (srcImg.length !== 0) product.srcImg = srcImg
    if (sizes.length !== 0) product.sizes = sizes
    product.toDisplay = toDisplay
    //   console.log('here2:')
    try {
        await product.save()
        return product
    } catch (e) {
        return e
    }
}

const deleteProduct = async (id) => {
    try {
        const product = await getProductById(id)
        if (!product)
            return null

        await product.remove()
        return product
    } catch (e) {
        return e
    }
}

module.exports = {
    createProduct,
    getProductById,
    getProducts,
    updateProduct,
    deleteProduct,
    getDistinctCats
}

