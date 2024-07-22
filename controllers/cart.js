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

        let sum = 0;
        let cartItems = await Promise.all(cartItemsInfo.map(async (itemInfo) => {
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
        cartItems.totalAmount = sum;

        res.render('cart', { cartItems });
    } catch (e) {
        console.error('Error fetching cart items:', e.message); // Changed to e.message for more concise error
        res.status(500).send("Error retrieving cart page.");
    }
}

async function getCartItems(req, res) {
    try {
        console.log('getCartItems called');
        const username = req.session.username; // Assuming you have session management
        if (!username) {
            console.log('User not logged in.');
            throw new Error('User not logged in');
        }
        const cartItems = await clientsService.getCartItemsFromDB(username);
        return cartItems;
    } catch (e) {
        console.error('Error fetching cart items:', e.message); // Changed to e.message for more concise error
        throw e; // Let the caller handle the error
    }
}

async function addCartItem(req, res) {
    const { productId, size, quantity } = req.body;
    const username = req.session.username;
    try {
        const { productId, size } = req.body;
        const username = req.session.username; // Assuming you have session management

        if (!username) {
            throw new Error('User not logged in');
        }

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
        const { productId } = req.body;
        const username = req.session.username; // Assuming you have session management

        if (!username) {
            throw new Error('User not logged in');
        }

    
        const result = await clientsService.removeCartItemFromDB(username, productId, size);
        res.json(result);
    } catch (e) {
        res.json({ success: false, message: 'Error removing item from cart' });
    }
}
async function addEditShirtToCart(req, res) {
    try {
        const imgSrc = req.body.dataURL
        const color = req.body.color
        const size = req.body.size
        
        const product = await productsService.createProduct("My creation", color, "", 50, "both", "", [imgSrc], [], false)
        const username = req.session.username; 
        if (!username) {
            throw new Error('User not logged in');
        }
        await clientsService.addCartItemToDB(username, product._id, size);

        // await clientsService.addItemToCart(product._id)
        res.send('Image saved to database');
    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).send('Internal Server Error');
    }
}



module.exports = {
    getCartPage,
    getCartItems,
    addCartItem,
    removeCartItem,
    addEditShirtToCart
};
