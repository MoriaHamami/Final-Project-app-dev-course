const productsService = require('../services/products');
const clientsService = require('../services/clients');

async function getCartPage(req, res) {
    try {
        const cartItemsInfo = await getCartItems(req, res);

        if (!cartItemsInfo) {
            return res.status(404).send("Cart items not found");
        }

        let sum = 0;
        let cartItems = await Promise.all(cartItemsInfo.map(async (itemInfo) => {
            const item = await productsService.getProductById(itemInfo.id);
            if (item) {
                item.size = itemInfo.size;
                sum += item.price || 0;
                return item;
            }
            return null;
        }));

        cartItems = cartItems.filter(item => item !== null);
        cartItems.totalAmount = sum;

        res.render('cart.ejs', { cartItems });
    } catch (e) {
        console.error('Error fetching cart items:', e);
        res.status(500).send("Error retrieving cart page.");
    }
}

async function getCartItems(req, res) {
    try {
        const username = req.session.username; // Assuming you have session management
        if (!username) {
            throw new Error('User not logged in');
        }
        return await clientsService.getCartItemsFromDB(username);
    } catch (e) {
        console.error('Error fetching cart items:', e);
        throw e; // Let the caller handle the error
    }
}
async function addCartItem(req, res) {
    try {
        console.log('Request body:', req.body);
        const { productId, size } = req.body;
        const username = req.session.username; // Assuming you have session management
        console.log('Username:', username);

        if (!username) {
            throw new Error('User not logged in');
        }

        await clientsService.addCartItemToDB(username, productId, size);
        res.status(200).json({ message: "Product added to cart successfully" }); // השתמש ב-json להחזרת תגובה
    } catch (e) {
        console.error('Error adding item to cart:', e.message);
        res.status(500).json({ message: `Error adding item to cart: ${e.message}` });
    }
}

async function removeCartItem(req, res) {
    try {
        console.log('Request body:', req.body);
        const { productId } = req.body;
        const username = req.session.username; // Assuming you have session management
        console.log('Username:', username);

        if (!username) {
            throw new Error('User not logged in');
        }

        await clientsService.removeCartItemFromDB(username, productId);
        res.status(200).json({ message: "Product removed from cart successfully" }); // השתמש ב-json להחזרת תגובה
    } catch (e) {
        console.error('Error removing item from cart:', e.message);
        res.status(500).json({ message: `Error removing item from cart: ${e.message}` });
    }
}

module.exports = {
    getCartPage,
    getCartItems,
    addCartItem,
    removeCartItem
};