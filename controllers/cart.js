const productsService = require('../services/products');
const clientsService = require('../services/clients');
const ticketsService = require('../services/tickets');

// Function to render the cart page
async function getCartPage(req, res) {
    try {
        const username = req.session.username;
        if (!username) {
            return res.redirect('/login');
        }

        const cartItemsInfo = await clientsService.getCartItemsFromDB(username);

        if (!cartItemsInfo) {
            return res.status(404).send("Cart items not found");
        }

        let sum = 0;
        let cartItems = await Promise.all(cartItemsInfo.map(async (itemInfo) => {
            let item;
            if (itemInfo.type === 'ticket') {
                item = await ticketsService.getTicketById(itemInfo.id);
            } else {
                item = await productsService.getProductById(itemInfo.id);
            }
            if (item) {
                item.size = itemInfo.size; // Ensure size is included from cart item
                item.quantity = itemInfo.quantity;
                item.cartItemId = itemInfo._id; // Adding the cart item _id
                sum += item.price || 0; // Calculate the total amount
                return { ...item.toObject(), type: itemInfo.type, cartItemId: itemInfo._id, size: itemInfo.size, price: item.price }; // Include cartItemId and size
            }
            return null;
        }));

        cartItems = cartItems.filter(item => item !== null);
        res.render('cart', { cartItems, totalAmount: sum, username });
    } catch (e) {
        res.status(500).send("Error retrieving cart page.");
    }
}

// Function to get cart items
async function getCartItems(req, res) {
    try {
        const username = req.session.username;
        if (!username) {
            return res.redirect('/login');
        }
        const cartItems = await clientsService.getCartItemsFromDB(username);
        res.json(cartItems);
    } catch (e) {
        throw e;
    }
}

// Function to add item to cart
async function addCartItem(req, res) {
    const { productId, size, quantity } = req.body;
    const username = req.session.username;
    try {
        if (!username) {
            return res.status(401).json({ success: false, message: 'User not logged in' });
        }

        const result = await clientsService.addCartItemToDB(username, productId, size, quantity);
        res.json(result);
    } catch (e) {
        res.status(500).json({ success: false, message: e.message || 'Error adding item to cart' });
    }
}

// Function to remove item from cart
async function removeCartItem(req, res) {
    const { cartItemId } = req.body;
    const username = req.session.username;
    try {
        if (!username) {
            return res.redirect('/login');
        }

        const result = await clientsService.removeCartItemFromDB(username, cartItemId);
        res.json(result);
    } catch (e) {
        res.json({ success: false, message: 'Error removing item from cart' });
    }
}

// Function to add custom shirt to cart
async function addEditShirtToCart(req, res) {
    try {
        const imgSrc = req.body.dataURL;
        const color = req.body.color;
        const size = req.body.size;

        const product = await productsService.createProduct("My creation", color, "", 50, "both", "", [imgSrc], [], false);
        const username = req.session.username;
        if (!username) {
            return res.redirect('/login');
        }
        await clientsService.addCartItemToDB(username, product._id, size);

        res.send('Image saved to database');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

// Function to checkout the cart
async function checkoutCart(req, res) {
    try {
        const username = req.session.username;
        if (!username) {
            return res.status(401).json({ success: false, message: 'User not logged in' });
        }

        const cartTotal = req.body.cartTotal;

        // Add cart items to orders and update spent amount
        const result = await clientsService.addCartToOrders(username, cartTotal);
        if (result.success) {
            res.json({ success: true, message: 'Cart checked out successfully' });
        } else {
            res.status(500).json({ success: false, message: result.message });
        }
    } catch (e) {
        res.status(500).json({ success: false, message: 'Error during checkout' });
    }
}

module.exports = {
    getCartPage,
    getCartItems,
    addCartItem,
    removeCartItem,
    addEditShirtToCart,
    checkoutCart
};
