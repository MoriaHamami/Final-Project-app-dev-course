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
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            throw new Error('Client not found');
        }
        return client.cartItems;
    } catch (e) {
        console.error('Error fetching cart items from DB:', e);
        throw e;
    }
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
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            throw new Error('Client not found');
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        const productObjectId = mongoose.Types.ObjectId(productId);
        console.log('productObjectId:', productObjectId)
        client.cartItems.push({ id: productObjectId, size, type: 'product' });
        await client.save();
        console.log('Item added to cart successfully');
    } catch (e) {
        console.error('Error adding item to cart:', e);
        throw e;
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error('Invalid product ID');
    }
}


// getOrdersById  : id --- fun servive 
async function removeCartItemFromDB(username, productId) {
    try {
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
    } catch (e) {
        console.error('Error removing item from cart:', e);
        throw e;
    }
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

// async function getCartItemsFromDB(username) {
//     try {
//         const client = await Client.findOne({ username })
//         if (!client) {
//             throw new Error('Client not found')
//         }
//         console.log('Client cart items:', client.cartItems)
//         return client.cartItems;
//     } catch (e) {
//         console.error('Error fetching cart items from DB:', e);
//         throw e;
//     }
// }

async function getClientByUsername(username) {
    try {
        const client = await Client.findOne({ username });
        return client
    } catch (e) {
        console.error('Error fetching client by ID:', e);
        throw e
    }
}

async function getStats() {
    try {
        // Client.aggregate([{
        //     $match : { $and : [ {owner: userId}, {date: { $gte: start, $lt: end } }] },
        // },{
        //     $group : {
        //         _id : null,
        //         total : {
        //             $sum : "$amount"
        //         }
        //     }
        // }],callback)

        // const data = await Client.aggregate([
        //     {
        //       $group: {
        //         _id: '$category',
        //         count: { $sum: 1 } // this means that the count will increment by 1
        //       }
        //     }
        //   ]);


        const data = await Client.aggregate(
            [
                {
                    $match: {
                        "dateCreated": {
                            $exists: true,
                            $ne: null
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: { year: { $year: "$dateCreated" } },
                        count: { $sum: 1 }
                    }

                }
                , {
                    $sort: { "_id.year": -1 }
                }
            ]
        )
        console.log('data clients:', data)
        return data
    } catch (e) {
        console.log('e:', e)
    }
}

module.exports = {
    getCartItemsFromDB,
    getClientsFromDB,
    removeCartItemFromDB,
    addCartItemToDB,
    getOrdersFromDB,
    getClientByUsername,
    getStats
}
