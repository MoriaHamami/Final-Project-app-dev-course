const productsService = require('../services/products');
const clientsService = require('../services/clients');

async function getFavePage(req, res) {
    try {
        console.log('getFavePage called');
        const faveItemsInfo = await getFaveItems(req, res);

        if (!faveItemsInfo) {
            console.log('No fave items found for the user.');
            return res.status(404).send("fave items not found");
        }

        console.log('fave Items Info:', FaveItemsInfo);

        let sum = 0;
        let faveItems = await Promise.all(faveItemsInfo.map(async (itemInfo) => {
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

        faveItems = faveItems.filter(item => item !== null);
        console.log('Filtered Fave Items:', faveItems);
        faveItems.totalAmount = sum;

        console.log('Rendering cart page with faveItems:', faveItems);
        res.render('fave', { faveItems });
    } catch (e) {
        console.error('Error fetching fave items:', e.message); // Changed to e.message for more concise error
        res.status(500).send("Error retrieving fave page.");
    }
}

async function getFaveItems(req, res) {
    try {
        console.log('getFaveItems called');
        const username = req.session.username; // Assuming you have session management
        if (!username) {
            console.log('User not logged in.');
            throw new Error('User not logged in');
        }
        const faveItems = await clientsService.getFaveItemsFromDB(username);
        console.log('Fetched fave Items from DB:', faveItems);
        return faveItems;
    } catch (e) {
        console.error('Error fetching fave items:', e.message); // Changed to e.message for more concise error
        throw e; // Let the caller handle the error
    }
}

async function addFaveItem(req, res) {
    try {
        console.log('Request body:', req.body);
        const { productId, size } = req.body;
        const username = req.session.username; // Assuming you have session management
        console.log('Username:', username);

        if (!username) {
            throw new Error('User not logged in');
        }

        await clientsService.addFaveItemToDB(username, productId, size);
        res.status(200).json({ message: "Product added to fave successfully" });
    } catch (e) {
        console.error('Error adding item to fave:', e.message);
        res.status(500).json({ message: `Error adding item to fave: ${e.message}` });
    }
}

async function removeFaveItem(req, res) {
    try {
        console.log('Request body:', req.body);
        const { productId } = req.body;
        const username = req.session.username; // Assuming you have session management
        console.log('Username:', username);

        if (!username) {
            throw new Error('User not logged in');
        }

        await clientsService.removeFaveItemFromDB(username, productId);
        res.status(200).json({ message: "Product removed from fave successfully" });
    } catch (e) {
        console.error('Error removing item from fave:', e.message);
        res.status(500).json({ message: `Error removing item from fave: ${e.message}` });
    }
}
async function addEditShirtToFave(req, res) {
    try {
        const imgSrc = req.body.dataURL
        const color = req.body.color
        
        const product = await productsService.createProduct("My creation", color, "", 50, "both", "", [imgSrc], [], false)
        // TODO: Add Item to fave with function noa wrote
        // await clientsService.addItemToFave(product._id)
        console.log('product:', product)
        res.send('Image saved to database');
    } catch (error) {
        console.error('Error saving image:', error);
        res.status(500).send('Internal Server Error');
    }

}

module.exports = {
    getFavePage,
    getFaveItems,
    addFaveItem,
    removeFaveItem,
    addEditShirtToFave
};
 

