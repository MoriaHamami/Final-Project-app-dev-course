const clientsService = require('../services/clients');

async function getClientsPage(req, res) {  
    try {
        const clientsInfo = await clientsService.getClientsFromDB();
        res.render('clients.ejs', { clients: clientsInfo });
    } catch (e) {
        console.error('Error fetching clients:', e);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getClientsPage
};
