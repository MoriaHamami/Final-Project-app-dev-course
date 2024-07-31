// Importing Services
const clientsService = require('../services/clients');
const ticketsService = require('../services/tickets');
const productsService = require('../services/products');

// Render client page with favorite items and orders
const getClientPage = async (req, res) => {
    try {
        const username = req.session.username;
        if (!username) {
            throw new Error('Username is not found in session'); // Check if username exists in session
        }

        const clientInfo = await clientsService.getClientWithFaveItemsAndOrders(username);
        if (!clientInfo) {
            return res.status(404).send('Client not found'); // Client is not found
        }

        res.render('client', { client: clientInfo }); // Render client page with information
    } catch (e) {
        res.status(500).send('Internal Server Error'); // errors
    }
};

// get client orders and calculate total amount
async function getClientOrders(req, res) {
    const id = req.params.id;
    try {
        const ordersFromDB = await clientsService.getOrdersFromDB(id);
        let sum = 0;
        let orders = [];

        for (let i = 0; i < ordersFromDB?.length; i++) {
            const orderFromDB = ordersFromDB[i];
            let order = [];

            for (let j = 0; j < orderFromDB?.length; j++) {
                const itemId = orderFromDB[j]?.id;
                const itemType = orderFromDB[j]?.type;
                let item = {};
                
                // Fetch item information based on type
                if (itemType === "ticket") {
                    item.productInfo = await ticketsService.getTicketById(itemId); // Ticket
                    item.imgs = [item.productInfo.opImg]; // Set ticket image
                } else {
                    item.productInfo = await productsService.getProductById(itemId); // Product
                    item.imgs = item.productInfo.srcImg; // Set product images
                }

                item.size = orderFromDB[j]?.size; // Item size
                item.type = itemType + 's'; // Item type
                order.push(item);
                sum += item?.price || 0; // Calculate total price
            }
            orders.push(order);
        }

        orders.totalAmount = sum; // Set total amount
        res.json(orders); // Send orders as JSON response
    } catch (e) {
        res.status(500).json({ error: e.message }); // errors
    }
}

// Render edit shirt page
function getEditShirt(req, res) {
    res.render('edit-shirt.ejs', {}); // Render edit shirt page
}

module.exports = {
    getClientPage,
    getEditShirt,
    getClientOrders
};
