const productsService = require('../services/products');
const clientsService = require('../services/clients');

async function getCartPage(req, res) {
    try {
        console.log('getCartPage called');
        const cartItemsInfo = await getCartItems(req, res);

        if (!cartItemsInfo) {
            console.log('No cart items found for the user.');
            return res.status(404).send("Cart items not found");
        }

        let sum = 0;
        let cartItems = await Promise.all(cartItemsInfo.map(async (itemInfo) => {
            console.log('Fetching product details for item:', itemInfo.id);
            const item = await productsService.getProductById(itemInfo.id);
            if (item) {
                item.size = itemInfo.size;
                sum += item.price || 0;
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

async function getCartItems(req, res) {
    try {
        console.log('getCartItems called');
        const username = req.session.username; // Assuming you have session management
        if (!username) {
            console.log('User not logged in.');
            throw new Error('User not logged in');
        }
        const cartItems = await clientsService.getCartItemsFromDB(username);
        console.log('Fetched Cart Items from DB:', cartItems);
        return cartItems;
    } catch (e) {
        console.error('Error fetching cart items:', e.message); // Changed to e.message for more concise error
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
        res.status(200).json({ message: "Product added to cart successfully" });
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
        res.status(200).json({ message: "Product removed from cart successfully" });
    } catch (e) {
        console.error('Error removing item from cart:', e.message);
        res.status(500).json({ message: `Error removing item from cart: ${e.message}` });
    }
}
async function addEditShirtToCart(req, res) {
    try {
        const imgSrc = req.body.dataURL
        const color = req.body.color
        
        const product = await productsService.createProduct("My creation", color, "", 50, "both", "", [imgSrc], [], false)
        // TODO: Add Item to cart with function noa wrote
        // await clientsService.addItemToCart(product._id)
        console.log('product:', product)
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
 

