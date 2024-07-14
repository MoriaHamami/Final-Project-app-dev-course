const clientsService = require('../services/clients');
// const loginController = require('./login');
const productsService = require('../services/products');

async function getClientsPage(req, res) {
    try {

        const clientsInfo = await clientsService.getClientsFromDB()
        // console.log('clientsInfo:', clientsInfo)
        // const cartItems = await getCartItems(req,res) 
        // res.render('clients.ejs', { clients: clientsInfo, cartItems })

        // clientsInfo.forEach(client => {
        //     // console.log('client:', client)
        //     return client.orders?.forEach(order => {
        //         console.log('order:', order)
        //         return order?.forEach(item=> productsService.getProductById(item.id))
        // })
        // })

        res.render('clients.ejs', { clients: clientsInfo })
    } catch (e) {
        console.error('Error fetching clients:', e)
        res.status(500).send('Internal Server Error')
    }
}

async function getClientOrders(req, res) {
    const id = req.params.id
    try {
        // Send the client id to the client service, and get back the orders
        const orders = await clientsService.getOrdersFromDB(id)
        // Send back to the ajax req, a res with the orders 
        res.json(orders)
    }
    catch (e) {
        res.json(e)
    }

}

// async function getCartItems(req,res){ 
//     try { 
//         const username = loginController.getUsername(req, res) 
//         return await clientsService.getCartItemsFromDB('lihideshe') 
//         // return await clientsService.getCartItemsFromDB(username) 

//     } catch (e) { 

//         console.error('Error fetching clients:', e);
//     }
// } 



module.exports = {
    getClientsPage,
    getClientOrders
};
