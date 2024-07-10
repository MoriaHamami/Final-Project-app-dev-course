const clientsService = require('../services/clients');
// const loginController = require('./login');
const productsService = require('../services/products');

async function getClientsPage(req, res) {
    try {
        const clientsInfo = await clientsService.getClientsFromDB()
        // const cartItems = await getCartItems(req,res) 
        // res.render('clients.ejs', { clients: clientsInfo, cartItems })
        clientsInfo.forEach(client => {
            return client.orders.forEach(order => productsService.getProductById(order.id))
        })
        res.render('clients.ejs', { clients: clientsInfo })
    } catch (e) {
        console.error('Error fetching clients:', e)
        res.status(500).send('Internal Server Error')
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
    getClientsPage
};
