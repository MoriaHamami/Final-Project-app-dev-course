const productsService = require('../services/products');
const clientsService = require('../services/clients');

async function getCartPage(req, res) {
    try {
        console.log('getCartPage called');
        const cartItemsInfo = await clientsService.getCartItemsFromDB(req.session.username);

        if (!cartItemsInfo) {
            console.log('No cart items found for the user.');
            return res.status(404).send("Cart items not found");
        }

        console.log('Cart Items Info:', cartItemsInfo);

        let sum = 0;
        let cartItems = await Promise.all(cartItemsInfo.map(async (itemInfo) => {
            console.log('Fetching product details for item:', itemInfo.id);
            const item = await productsService.getProductById(itemInfo.id);
            if (item) {
                item.size = itemInfo.size;
                item.quantity = itemInfo.quantity; // Make sure to include quantity
                sum += item.price * itemInfo.quantity || 0;
                return item;
            } else {
                console.log('Product not found for id:', itemInfo.id);
            }
            return null;
        }));

        cartItems = cartItems.filter(item => item !== null);
        console.log('Filtered Cart Items:', cartItems);
        cartItems.totalAmount = sum;

        console.log('Rendering cart page with cartItems:', cartItems);
        res.render('cart', { cartItems });
    } catch (e) {
        console.error('Error fetching cart items:', e.message); // Changed to e.message for more concise error
        res.status(500).send("Error retrieving cart page.");
    }
}

async function addCartItem(req, res) {
    const { productId, size, quantity } = req.body;
    const username = req.session.username;
    try {
        const result = await clientsService.addCartItemToDB(username, productId, size, quantity);
        res.json(result);
    } catch (e) {
        res.json({ success: false, message: 'Error adding item to cart' });
    }
}

async function removeCartItem(req, res) {
    const { productId, size } = req.body;
    const username = req.session.username;
    try {
        const result = await clientsService.removeCartItemFromDB(username, productId, size);
        res.json(result);
    } catch (e) {
        res.json({ success: false, message: 'Error removing item from cart' });
    }
}

async function addEditShirtToCart(req, res) {
    // פונקציה לטיפול בעריכת חולצה והוספתה לעגלה
}

module.exports = {
    getCartPage,
    addCartItem,
    removeCartItem,
    addEditShirtToCart
};
