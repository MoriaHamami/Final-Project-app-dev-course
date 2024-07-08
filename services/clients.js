const clients = require('../models/clients');

const getClientsFromDB = async () => {
    try {
        const clientsFromDB = await clients.find({});
        console.log(clientsFromDB); 
        return clientsFromDB; 
    } catch (e) {
        console.error('Error fetching clients from DB:', e);
    }
}

module.exports = {
    getClientsFromDB,
};

// getOrdersById  : id --- fun servive 

const getOrdersById = async (id) => {
    return await orders.findById(id)
}
