const mongoose = require('mongoose');
const Client = require('../models/clients');
const Product = require('../models/products');
const Ticket = require('../models/tickets');

async function getClientsFromDB() {
    try {
        const clientsFromDB = await Client.find({});
        return clientsFromDB;
    } catch (e) {
        console.error('Error fetching clients from DB:', e);
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

async function addCartItemToDB(username, productId, quantity) {
    try {
        console.log('Adding item to cart for user:', username);
        console.log('Quantity to add:', quantity);
        const client = await Client.findOne({ username });
        if (!client) {
            throw new Error('Client not found');
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        const productObjectId = mongoose.Types.ObjectId(productId);
        console.log('productObjectId:', productObjectId)

        // Fetch the product to check if it's a ticket
        const product = await Product.findById(productObjectId);
        const isTicket = await Ticket.exists({ _id: productObjectId });

        const type = isTicket ? 'ticket' : 'product';
        const size = isTicket ? 1 : null;

        const existingCartItem = client.cartItems.find(item => item.id.equals(productObjectId) && item.size === size);

        if (existingCartItem) {
            existingCartItem.quantity += parseInt(quantity, 10);
        } else {
            client.cartItems.push({ id: productObjectId, type, size, quantity: parseInt(quantity, 10) });
        }

        await client.save();
        console.log('Item added to cart successfully');
        return { success: true, message: 'Item added to cart successfully' };
    } catch (e) {
        console.error('Error adding item to cart:', e);
        return { success: false, message: 'Error adding item to cart' };
    }
}

async function removeCartItemFromDB(username, productId, size) {
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            console.error('Client not found:', username);
            return { success: false, message: 'Client not found' };
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return { success: false, message: 'Invalid product ID' };
        }

        const productObjectId = mongoose.Types.ObjectId(productId);
        const cartItemIndex = client.cartItems.findIndex(item => item.id.equals(productObjectId) && item.size === size);

        if (cartItemIndex > -1) {
            client.cartItems.splice(cartItemIndex, 1); // Remove the item
            await client.save();
            console.log('Item removed from cart successfully');
            return { success: true, message: 'Product removed from cart successfully' };
        } else {
            console.error('Item not found in cart:', productId);
            return { success: false, message: 'Item not found in cart' };
        }
    } catch (e) {
        console.error('Error removing item from cart:', e);
        return { success: false, message: 'Error removing item from cart' };
    }
}

async function getOrdersFromDB(id) {
    try {
        const client = await Client.findById(id);
        return client?.orders;
    } catch (e) {
        console.log('e:', e);
    }
}

async function addCartToOrders(username) {
    try {
        console.log('Adding cart to orders for user:', username);
        const client = await Client.findOne({ username });
        if (!client) {
            console.error('Client not found:', username);
            throw new Error('Client not found');
        }

        client.orders.push(...client.cartItems);
        client.cartItems = [];
        await client.save();

        console.log('Cart added to orders successfully');
        return { success: true, message: 'Cart added to orders successfully' };
    } catch (e) {
        console.error('Error adding cart to orders:', e);
        return { success: false, message: 'Error adding cart to orders' };
    }
}

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
        const data = await Client.aggregate([
            {
                $match: {
                    "dateCreated": {
                        $exists: true,
                        $ne: null
                    }
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$dateCreated" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1 }
            }
        ]);
        console.log('data clients:', data);
        return data;
    } catch (e) {
        console.log('e:', e);
    }
}

const deleteClient = async (id) => {
    try {
        const client = await Client.findById(id);
        if (!client)
            return null;

        await client.remove();
        return client;
    } catch (e) {
        return e;
    }
};

const blockClient = async (id, isBanned) => {
    console.log("in service");
    try {
        const client = await Client.findById(id);
        if (!client) {
            return { success: false, message: 'Client not found' };
        }

        client.isBanned = isBanned;
        await client.save();

        return { success: true, message: 'Client status updated successfully', client };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Server error', error: e };
    }
}

const getClientByIdFromDB = async (clientId) => {
    try {
        const client = await Client.findById(clientId);
        return client;
    } catch (e) {
        console.error('Error fetching client from DB:', e);
        throw e;
    }
};

async function getClientWithFaveItemsAndOrders(username) {
    try {
        const client = await Client.findOne({ username }).lean();

        if (!client) {
            throw new Error('Client not found');
        }

        const faveItems = await Product.find({ _id: { $in: client.faveItems } }).lean();

        const orders = [];
        for (const orderList of client.orders) {
            const orderDetails = [];
            for (const order of orderList) {
                if (order.type === 'ticket') {
                    const ticketDetails = await Ticket.findById(order.id).lean();
                    if (ticketDetails) {
                        orderDetails.push({ ...order, details: ticketDetails });
                    }
                } else {
                    const productDetails = await Product.findById(order.id).lean();
                    if (productDetails) {
                        orderDetails.push({ ...order, details: productDetails });
                    }
                }
            }
            orders.push(orderDetails);
        }

        const cartItems = [];
        for (const item of client.cartItems) {
            if (item.type === 'ticket') {
                const ticketDetails = await Ticket.findById(item.id).lean();
                if (ticketDetails) {
                    cartItems.push({ ...item, details: ticketDetails });
                }
            } else {
                const productDetails = await Product.findById(item.id).lean();
                if (productDetails) {
                    cartItems.push({ ...item, details: productDetails });
                }
            }
        }

        client.faveItems = faveItems;
        client.orders = orders;
        client.cartItems = cartItems;

        return client;
    } catch (e) {
        console.error('Error fetching client with favorite items and orders from DB:', e.message);
        throw e;
    }
}

module.exports = {
    getCartItemsFromDB,
    getClientsFromDB,
    removeCartItemFromDB,
    addCartItemToDB,
    getOrdersFromDB,
    getStats,
    addCartToOrders,
    deleteClient,
    blockClient,
    getClientByIdFromDB,
    getClientByUsername,
    getClientWithFaveItemsAndOrders
};
