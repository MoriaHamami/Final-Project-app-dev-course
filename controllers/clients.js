const clientsService = require('../services/clients');
const productsService = require('../services/products');

async function getClientsPage(req, res) {  
    try {
        const clientsInfo = await clientsService.getClientsFromDB() 
        // const cartItems = await getCartItems(req,res) 
        // res.render('clients.ejs', { clients: clientsInfo, cartItems })
clientsInfo.forEach(client=>{
    return client.orders.forEach(orderID=>productsService.getProductById(orderID))
}) 
        res.render('clients.ejs', { clients: clientsInfo })
    } catch (e) {
        console.error('Error fetching clients:', e)
        res.status(500).send('Internal Server Error')
    }
}



module.exports = {
    getClientsPage
};