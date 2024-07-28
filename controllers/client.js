const clientsService = require('../services/clients');
const ticketsService = require('../services/tickets'); // Missing import for ticketsService
const productsService = require('../services/products'); // Missing import for productsService

// Render client page with favorite items and orders
const getClientPage = async (req, res) => {
    try {
        const username = req.session.username;
        if (!username) {
            throw new Error('Username is not found in session');
        }

        const clientInfo = await clientsService.getClientWithFaveItemsAndOrders(username);
        if (!clientInfo) {
            return res.status(404).send('Client not found');
        }

        res.render('client', { client: clientInfo });
    } catch (e) {
        console.error('Error fetching client:', e.message);
        res.status(500).send('Internal Server Error');
    }
};

// Fetch client orders and calculate total amount
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
                    item.productInfo = await ticketsService.getTicketById(itemId);
                    item.imgs = [item.productInfo.opImg];
                } else {
                    item.productInfo = await productsService.getProductById(itemId);
                    item.imgs = item.productInfo.srcImg;
                }

                item.size = orderFromDB[j]?.size;
                item.type = itemType + 's';
                order.push(item);
                sum += item?.price || 0;
            }
            orders.push(order);
        }

        orders.totalAmount = sum;
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// Render edit shirt page
function getEditShirt(req, res){
    res.render('edit-shirt.ejs', {})
}

module.exports = {
    getClientPage,
    getEditShirt,
    getClientOrders
};
