const Client = require('../models/clients');

async function getCartItemsFromDB(username) {
    const client = await Client.findOne({ username });
    return client.cartItems;
}

async function addCartItemToDB(username, productId, size) {
    const client = await Client.findOne({ username });
    if (!client) throw new Error('Client not found');

    client.cartItems.push({ id: productId, size });
    await client.save();
}

module.exports = {
    getCartItemsFromDB,
    addCartItemToDB
};