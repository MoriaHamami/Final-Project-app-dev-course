const mongoose = require('mongoose');
const Client = require('../models/clients');

const getClientsFromDB = async () => {
    try {
        const clientsFromDB = await Client.find({})
        return clientsFromDB
    } catch (e) {
        console.error('Error fetching clients from DB:', e)
    }
}

async function getCartItemsFromDB(username) {
    const client = await Client.findOne({ username });
    if (!client) {
        throw new Error('Client not found');
    }
    return client.cartItems;
}

// async function getCartItemsFromDB(username) {
//     try {
//         const client = await Client.findOne({ username })
//         return client?.cartItems
//     }
//     catch (e) {
//     }
// }
async function addCartItemToDB(username, productId, size) {
    console.log('Adding item to cart for user:', username);
    const client = await Client.findOne({ username });
    if (!client) {
        console.error('Client not found:', username);
        throw new Error('Client not found');
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
    }
}


// getOrdersById  : id --- fun servive 
async function removeCartItemFromDB(username, productId) {
    console.log('Removing item from cart for user:', username);
    const client = await Client.findOne({ username });
    if (!client) {
        console.error('Client not found:', username);
        throw new Error('Client not found');
    }

    // const getOrdersById = async (id) => {
    //     return await orders.findById(id)
    // }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
    }

    const productObjectId = mongoose.Types.ObjectId(productId);
    client.cartItems = client.cartItems.filter(item => !item.id.equals(productObjectId));
    await client.save();
    console.log('Item removed from cart successfully');
}

async function getOrdersFromDB(id) {
    try {
        const client = await Client.findById(id)
        return client?.orders
    }
    catch (e) {
        console.log('e:', e)
    }
}

module.exports = {
    getCartItemsFromDB,
    getClientsFromDB,
    removeCartItemFromDB,
    addCartItemToDB,
    getOrdersFromDB
}
