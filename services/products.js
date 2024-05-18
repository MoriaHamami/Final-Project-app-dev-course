const Product = require('../models/products');

const createProduct = async (title ="", color="", cat="", price=0, gender="", favePlayer="", srcImg=[], sizes=[]) => {
    // Product.init() // Document gets generated (and gets an id)

    const product = new Product({
        title,
        color,
        cat,
        srcImg,
        favePlayer,
        price,
        gender,
        sizes
    })
// console.log('product:', product)
    return await product.save();
}

const getProductById = async (id) => {
    return await Product.findById(id);
}

const getProducts = async () => {
    return await Product.find({});
};

const updateProduct = async (id, title ="", color="", cat="", price=0, gender="", favePlayer="", srcImg=[], sizes=[]) => {
    const product = await getProductById(id);
    // console.log('here:', product)
    if (!product)
        return null;

    if(title)product.title = title
     if(color)product.color = color
     if(price)product.price = price
     if(gender)product.gender = gender
     if(favePlayer)product.favePlayer = favePlayer
     if(srcImg.length !== 0)product.srcImg = srcImg
     if(sizes.length !== 0)product.sizes = sizes
    //   console.log('here2:')
     try{
        

         await product.save()
         return product
     }catch(e){
        return e
     }
}

const deleteProduct = async (id) => {
    const product = await getProductById(id);
    if (!product)
        return null;

    await product.remove();
    return product;
};

module.exports = {
    createProduct,
    getProductById,
    getProducts,
    updateProduct,
    deleteProduct
}

