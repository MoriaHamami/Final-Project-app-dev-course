// services/products.js
const Product = require('../models/products');

async function getProductById(id) {
    try {
        const product = await Product.findById(id);
        console.log('Product found:', product);
        return product;
    } catch (e) {
        console.error('Error fetching product by ID:', e);
        throw e;
    }
}

module.exports = {
    getProductById
};

// services/clients.js
const Client = require('../models/clients');

async function getFaveIetemsFromDB(username) {
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            throw new Error('Client not found');
        }
        console.log('Client faveitems:', client.faveItems);
        return client.faveItems;
    } catch (e) {
        console.error('Error fetching fave items from DB:', e);
        throw e;
    }
}

module.exports = {
    getFaveItemsFromDB
};
