const Product = require('../models/products');

const createProduct = async (title ="", color="", cat="", price=0, gender="", favePlayer="", srcImg=[]) => {
    const product = new Product({
        title,
        color,
        cat,
        srcImg,
        favePlayer,
        price,
        gender
    })
// console.log('product:', product)
    return await product.save();
};

const getProductById = async (id) => {
    return await Product.findById(id);
};

const getProducts = async () => {
    return await Product.find({});
};

const updateProduct = async (id, title) => {
    const product = await getProductById(id);
    if (!product)
        return null;

    product.title = title;
    await product.save();
    return product;
};

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

