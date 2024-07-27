const productsService = require('../services/products');
const clientsService = require('../services/clients');
const ticketsService = require('../services/tickets');

// Function to render the cart page
async function getCartPage(req, res) {
    try {
        console.log('getCartPage called');
        const username = req.session.username;
        if (!username) {
            console.log('User not logged in.');
            return res.redirect('/login');
        }

        const cartItemsInfo = await clientsService.getCartItemsFromDB(username);
        console.log('cartItemsInfo:', cartItemsInfo);

        if (!cartItemsInfo) {
            console.log('No cart items found for the user.');
            return res.status(404).send("Cart items not found");
        }

        let sum = 0;
        let cartItems = await Promise.all(cartItemsInfo.map(async (itemInfo) => {
            let item;
            if (itemInfo.type === 'ticket') {
                item = await ticketsService.getTicketById(itemInfo.id);
                console.log('Fetched ticket:', item);
            } else {
                item = await productsService.getProductById(itemInfo.id);
                console.log('Fetched product:', item);
            }
            if (item) {
                item.size = itemInfo.size;
                item.quantity = itemInfo.quantity;
                item.cartItemId = itemInfo._id; // Adding the cart item _id
                sum += item.price * itemInfo.quantity || 0;
                return { ...item.toObject(), type: itemInfo.type, cartItemId: itemInfo._id }; // Make sure to include cartItemId
            } else {
                console.log('Item not found for id:', itemInfo.id);
            }
            return null;
        }));

        cartItems = cartItems.filter(item => item !== null);
        cartItems.totalAmount = sum;
        console.log('Final cartItems:', cartItems);

        res.render('cart', { cartItems, username });
    } catch (e) {
        console.error('Error fetching cart items:', e.message);
        res.status(500).send("Error retrieving cart page.");
    }
}

// Function to get cart items
async function getCartItems(req, res) {
    try {
        console.log('getCartItems called');
        const username = req.session.username; // Assuming you have session management
        if (!username) {
            console.log('User not logged in.');
            return res.redirect('/login');
        }
        const cartItems = await clientsService.getCartItemsFromDB(username);
        return cartItems;
    } catch (e) {
        console.error('Error fetching cart items:', e.message); // Changed to e.message for more concise error
        throw e; // Let the caller handle the error
    }
}

// Function to add item to cart
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
        console.error('Error adding item to cart:', e.message);
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
        console.error('Error removing item from cart:', e.message);
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
        console.error('Error saving image:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function checkoutCart(req, res) {
    try {
        const username = req.session.username;
        if (!username) {
            return res.status(401).json({ success: false, message: 'User not logged in' });
        }

        // Add cart items to orders
        const result = await clientsService.addCartToOrders(username);
        if (result.success) {
            res.json({ success: true, message: 'Cart checked out successfully' });
        } else {
            res.status(500).json({ success: false, message: result.message });
        }
    } catch (e) {
        console.error('Error during checkout:', e.message);
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
