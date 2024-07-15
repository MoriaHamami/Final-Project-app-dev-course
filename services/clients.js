const clients = require('../models/clients');

const getClientsFromDB = async () => {
    try {
        const clientsFromDB = await clients.find({})
        return clientsFromDB 
    } catch (e) {
        console.error('Error fetching clients from DB:', e)
    }
}

async function getCartItemsFromDB(username) { 
    try{
        const client = await clients.findOne({username})
       return client?.cartItems
    } 
    catch(e){ 

    }
} 

async function getOrdersFromDB(id) { 
    try{
        const client = await clients.findById(id)
       return client?.orders
    } 
    catch(e){ 

    }
} 

module.exports = {
    getClientsFromDB, getCartItemsFromDB,getOrdersFromDB
};

// getOrdersById  : id --- fun servive 

// const getOrdersById = async (id) => {
//     return await orders.findById(id)
// }
 

