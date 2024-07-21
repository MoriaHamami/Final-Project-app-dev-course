const clientsService = require('../services/clients');

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
        console.error(e.stack);
        res.status(500).send('Internal Server Error');
    }
};

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
                
                if (itemType === "ticket") {
                    item.productInfo = await ticketsService.getTicketById(itemId);
                    item.imgs = [item.productInfo.opImg];
                } else {
                    item.productInfo = await productsService.getProductById(itemId);
                    item.imgs = item.productInfo.srcImg;
                }

                item.size = orderFromDB[j]?.size;
                item.type = orderFromDB[j]?.type + 's';
                order.push(item);
                sum += item?.price || 0;
            }
            orders.push(order);
        }

        orders.totalAmount = sum;
        res.json(orders);
    } catch (e) {
        res.json(e);
    }
}

module.exports = {
    getClientPage,
    getClientOrders
};
