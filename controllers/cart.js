const productsService = require('../services/products');
const loginController = require('./login');
const clientsService = require('../services/clients');


async function getCartPage(req, res) {
    try {
        const cartItemsInfo = await getCartItems(req, res)

        let sum = 0
        let cartItems = []
        for (let i = 0; i < cartItemsInfo?.length; i++) {
            itemId = cartItemsInfo[i]?.id
            const item = await productsService.getProductById(itemId)
            console.log("test",item)
            cartItems.push(item)
            sum += item?.price || 0
        }

        cartItems.totalAmount = sum

        res.render('cart.ejs', { cartItems })
    }
    catch (e) {
        console.log(e)
    }
}
async function getCartItems(req, res) {
    try {
        // const username = loginController.getUsername(req, res)
        return await clientsService.getCartItemsFromDB('lihideshe')
        // return await clientsService.getCartItemsFromDB(username) 

    } catch (e) {

        console.error('Error fetching clients:', e);
    }
}



module.exports = {
    getCartPage
}