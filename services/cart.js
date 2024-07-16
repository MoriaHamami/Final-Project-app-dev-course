// services/products.js
const Product = require('../models/products');

async function getProductById(id) {
    try {
        const product = await Product.findById(id);
        return product;
    } catch (e) {
        console.error('Error fetching product by ID:', e);
        throw e;
    }
}


// services/clients.js
const Client = require('../models/clients');

async function getCartItemsFromDB(username) {
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            throw new Error('Client not found');
        }
        console.log('Client cart items:', client.cartItems);
        return client.cartItems;
    } catch (e) {
        console.error('Error fetching cart items from DB:', e);
        throw e;
    }
}


module.exports = {
    getProductById,
    getCartItemsFromDB
};


