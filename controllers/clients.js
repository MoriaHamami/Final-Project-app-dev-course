const clientsService = require('../services/clients');
const productsService = require('../services/products');
const ticketsService = require('../services/tickets');

// Function to get clients from the database and render the clients page
async function getClientsPage(req, res) {
    try {
        const clientsInfo = await clientsService.getClientsFromDB();
        res.render('clients.ejs', { clients: clientsInfo });
    } catch (e) {
        console.error('Error fetching clients:', e);
        res.status(500).send('Internal Server Error');
    }
}

// Function to get client orders and return as a JSON response
async function getClientOrders(req, res) {
    const id = req.params.id;
    try {
        const ordersFromDB = await clientsService.getOrdersFromDB(id);
        let sum = 0;
        let orders = [];

        //  each order
        for (let i = 0; i < ordersFromDB?.length; i++) {
            const orderFromDB = ordersFromDB[i];
            let order = [];

            for (let j = 0; j < orderFromDB?.length; j++) {
                const itemId = orderFromDB[j]?.id;
                const itemType = orderFromDB[j]?.type;
                let item = {};

                //  product (ticket or product)
                if (itemType === "ticket") {
                    item.productInfo = await ticketsService.getTicketById(itemId);
                    item.imgs = [item.productInfo?.opImg];
                } else {
                    item.productInfo = await productsService.getProductById(itemId);
                    item.imgs = item.productInfo?.srcImg;
                }

                // Add item details 
                if (item.productInfo) {
                    item.size = orderFromDB[j]?.size;
                    item.type = itemType + 's';
                    order.push(item);
                    sum += item?.price || 0;
                }
            }
            orders.push(order);
        }

        orders.totalAmount = sum;
        res.json(orders);
    } catch (e) {
        res.json(e);
    }
}

// Function to delete a client by ID
const deleteClient = async (req, res) => {
    try {
        const client = await clientsService.deleteClient(req.params.id);

        // if client not found 
        if (!client) {
            res.status(404).json({ errors: ['client not found'] });
        } else {
            res.json(client);
        }
    } catch (e) {
        res.json("Client wasn't deleted successfully" + e);
    }
}

// Function to block or unblock a client by ID
const blockClient = async (req, res) => {
    try {
        const id = req.params.id;
        const { isBanned } = req.body;
        await clientsService.blockClient(id, isBanned);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getClientsPage,
    getClientOrders,
    deleteClient,
    blockClient
};
