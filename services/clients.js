const mongoose = require('mongoose');
const Client = require('../models/clients');

async function getCartItemsFromDB(username) {
    const client = await Client.findOne({ username });
    if (!client) {
        throw new Error('Client not found');
    }
    return client.cartItems;
}

async function addCartItemToDB(username, productId, size) {
    console.log('Adding item to cart for user:', username);
    const client = await Client.findOne({ username });
    if (!client) {
        console.error('Client not found:', username);
        throw new Error('Client not found');
    }
}

async function getCartItemsFromDB(username) { 
    try{
        const client = await clients.findOne({username})
       return client?.cartItems
    } 
    catch(e){ 

    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
    }

    const productObjectId = mongoose.Types.ObjectId(productId);
    client.cartItems.push({ id: productObjectId, size, type: 'product' });
    await client.save();
    console.log('Item added to cart successfully');
}

async function removeCartItemFromDB(username, productId) {
    console.log('Removing item from cart for user:', username);
    const client = await Client.findOne({ username });
    if (!client) {
        console.error('Client not found:', username);
        throw new Error('Client not found');
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
    }

    const productObjectId = mongoose.Types.ObjectId(productId);
    client.cartItems = client.cartItems.filter(item => !item.id.equals(productObjectId));
    await client.save();
    console.log('Item removed from cart successfully');
}

async function getOrdersFromDB(id) { 
    try{
        const client = await clients.findById(id)
       return client?.orders
    } 
    catch(e){ 

    }
} 

module.exports = {
    getCartItemsFromDB,
    addCartItemToDB,
    removeCartItemFromDB,
    getOrdersFromDB
};


// getOrdersById  : id --- fun servive 

// const getOrdersById = async (id) => {
//     return await orders.findById(id)
// }
 

