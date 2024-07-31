const mongoose = require('mongoose');
const Client = require('../models/clients');
const Product = require('../models/products');
const Ticket = require('../models/tickets');

// Fetch all clients from the database
async function getClientsFromDB() {
    try {
        const clientsFromDB = await Client.find({});
        return clientsFromDB;
    } catch (e) {
        console.error('Error fetching clients from DB:', e);
    }
}

// Fetch cart items for a specific user by username
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

// Add a new item to the user's cart
async function addCartItemToDB(username, productId, size, quantity) {
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            throw new Error('Client not found');
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product ID');
        }

        const productObjectId = mongoose.Types.ObjectId(productId);

        // Check if the product exists and if it's a ticket
        const product = await Product.findById(productObjectId);
        const isTicket = await Ticket.exists({ _id: productObjectId });

        const type = isTicket ? 'ticket' : 'product';

        // Validate size if required for non-ticket products
        if (!isTicket && product.sizes && product.sizes.length > 0 && !size) {
            throw new Error('Size is required for non-ticket products that have sizes');
        }

        // Add new item to cart with unique _id
        client.cartItems.push({
            _id: new mongoose.Types.ObjectId(),
            id: productObjectId,
            type,
            size,
            quantity: parseInt(quantity, 10)
        });

        await client.save();
        return { success: true, message: 'Item added to cart successfully' };
    } catch (e) {
        console.error('Error adding item to cart:', e);
        return { success: false, message: e.message || 'Error adding item to cart' };
    }
}

// Remove an item from the user's cart by cart item ID
async function removeCartItemFromDB(username, cartItemId) {
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            return { success: false, message: 'Client not found' };
        }

        if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
            return { success: false, message: 'Invalid cart item ID' };
        }

        // Find the cart item by _id
        const cartItemIndex = client.cartItems.findIndex(item => item._id && item._id.equals(cartItemId));

        if (cartItemIndex > -1) {
            client.cartItems.splice(cartItemIndex, 1);

            // Update the client document without versioning
            await Client.updateOne(
                { _id: client._id },
                { $set: { cartItems: client.cartItems } }
            );

            return { success: true, message: 'Cart item removed successfully' };
        } else {
            return { success: false, message: 'Cart item not found' };
        }
    } catch (e) {
        console.error('Error removing cart item:', e);
        return { success: false, message: 'Error removing cart item' };
    }
}

// Fetch orders for a specific client by ID
async function getOrdersFromDB(id) {
    try {
        const client = await Client.findById(id);
        return client?.orders;
    } catch (e) {
        console.error('Error fetching orders from DB:', e);
    }
}

// Add the user's cart items to their orders and clear the cart
async function addCartToOrders(username, cartTotal) {
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            throw new Error('Client not found');
        }

        // Create a new order list from the cart items
        const newOrder = client.cartItems.map(item => ({
            id: item.id,
            type: item.type,
            size: item.size
        }));

        // Add the cart to the orders and update spent amount
        client.orders.push(newOrder);
        client.cartItems = [];
        client.spent = (client.spent || 0) + cartTotal;

        await client.save();

        return { success: true, message: 'Cart added to orders successfully' };
    } catch (e) {
        console.error('Error adding cart to orders:', e);
        return { success: false, message: 'Error adding cart to orders' };
    }
}

// Fetch a client by username
async function getClientByUsername(username) {
    try {
        const client = await Client.findOne({ username });
        return client;
    } catch (e) {
        console.error('Error fetching client by username:', e);
        throw e;
    }
}

// Fetch client registration stats
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
        return data;
    } catch (e) {
        console.error('Error fetching stats:', e);
    }
}

// Delete a client by ID
const deleteClient = async (id) => {
    try {
        const client = await Client.findById(id);
        if (!client) return null;

        await client.remove();
        return client;
    } catch (e) {
        return e;
    }
};

// Block or unblock a client by ID
const blockClient = async (id, isBanned) => {
    try {
        const client = await Client.findById(id);
        if (!client) {
            return { success: false, message: 'Client not found' };
        }

        client.isBanned = isBanned;
        await client.save();

        return { success: true, message: 'Client status updated successfully', client };
    } catch (e) {
        console.error('Error blocking/unblocking client:', e);
        return { success: false, message: 'Server error', error: e };
    }
}

// Fetch a client by ID
const getClientByIdFromDB = async (clientId) => {
    try {
        const client = await Client.findById(clientId);
        return client;
    } catch (e) {
        console.error('Error fetching client from DB:', e);
        throw e;
    }
};

// Fetch a client with favorite items and detailed orders by username
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

// Fetch favorite items for a specific user by username
async function getFaveIetemsFromDB(username) {
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            throw new Error('Client not found');
        }
        return client.faveItems;
    } catch (e) {
        console.error('Error fetching fave items from DB:', e);
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
    getClientWithFaveItemsAndOrders,
    getFaveIetemsFromDB
};
