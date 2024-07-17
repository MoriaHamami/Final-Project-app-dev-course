const clientsService = require('../services/clients');
const productsService = require('../services/products');
const loginService = require('../services/login');

// Func renders the manager page
async function getManagerPage(req, res) {
    try {
        const loggedInUser = req.session.username
        
        const managerInfo = await clientsService.getClientByUsername(loggedInUser)
        res.render('manager.ejs', { manager: managerInfo })
    } catch (e) {
        console.log('e:', e)
    }
}

async function getStats(req, res){
    try {        
        const clientStats = await clientsService.getStats()
        const productStats = await productsService.getStats()
        // console.log('managerInfo:', stats)
        const stats = {productStats, clientStats }
        res.json(stats)
    } catch (e) {
        console.log('e:', e)
    }

}

module.exports = {
    getManagerPage,
    getStats
} 
