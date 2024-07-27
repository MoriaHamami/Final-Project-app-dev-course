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

        const product = await Product.findById(productObjectId);
        const isTicket = await Ticket.exists({ _id: productObjectId });

        const type = isTicket ? 'ticket' : 'product';

        // בדיקה אם המוצר דורש מידה, ולוודא שהמידה ניתנה אם כן
        if (!isTicket && product.sizes && product.sizes.length > 0 && !size) {
            throw new Error('Size is required for non-ticket products that have sizes');
        }

        // מצא מוצר זהה בעגלה
        const existingCartItem = client.cartItems.find(item => item.id.equals(productObjectId) && item.size === size);

        if (existingCartItem) {
            // אם נמצא מוצר זהה, עדכן את הכמות
            existingCartItem.quantity += parseInt(quantity, 10);
        } else {
            // אם לא נמצא מוצר זהה, הוסף מוצר חדש עם מזהה _id ייחודי
            client.cartItems.push({ _id: new mongoose.Types.ObjectId(), id: productObjectId, type, size, quantity: parseInt(quantity, 10) });
        }

        await client.save();
        return { success: true, message: 'Item added to cart successfully' };
    } catch (e) {
        console.error('Error adding item to cart:', e);
        return { success: false, message: e.message || 'Error adding item to cart' };
    }
}

async function removeCartItemFromDB(username, cartItemId) {
    try {
        const client = await Client.findOne({ username });
        if (!client) {
            console.error('Client not found:', username);
            return { success: false, message: 'Client not found' };
        }

        if (!mongoose.Types.ObjectId.isValid(cartItemId)) {
            return { success: false, message: 'Invalid cart item ID' };
        }

        console.log('Client cart items:', client.cartItems); // Debugging
        console.log('Searching for cart item:', cartItemId); // Debugging

        // מצא את הפריט לפי ה-_id של הפריט בעגלה
        const cartItemIndex = client.cartItems.findIndex(item => item._id && item._id.equals(cartItemId));

        console.log('Found cartItemIndex:', cartItemIndex); // Debugging

        if (cartItemIndex > -1) {
            client.cartItems.splice(cartItemIndex, 1);

            // עדכן את מסמך הלקוח ללא שימוש במנגנון גרסאות
            await Client.updateOne(
                { _id: client._id },
                { $set: { cartItems: client.cartItems } }
            );

            console.log('Item removed from cart successfully');
            return { success: true, message: 'Cart item removed successfully' };
        } else {
            console.error('Cart item not found:', cartItemId);
            return { success: false, message: 'Cart item not found' };
        }
    } catch (e) {
        console.error('Error removing cart item:', e);
        return { success: false, message: 'Error removing cart item' };
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

        // יצירת רשימה חדשה של פריטי ההזמנה מהעגלה
        const newOrder = client.cartItems.map(item => ({
            id: item.id,
            type: item.type,
            size: item.size
        }));

        client.orders.push(newOrder);
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
        return client;
    } catch (e) {
        console.error('Error fetching client by ID:', e);
        throw e;
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
