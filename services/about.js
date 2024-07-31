const About = require('../models/about');

// Get coordinates from the database
const getCoords = async () => {
    try {
        const param = 'shops'; // The key to find the data
        const coords = await About.findOne({ param }); // Find the data in the database
        return coords; // Return the coordinates
    } catch (e) {
        console.log('Error getting coordinates:', e); // Print error message
    }
}

// Update shops in the database
async function updateShops(shops) {
    if (!shops) return null; // If no shops data is provided, return null
    try {
        const param = 'shops'; // The key to find the data
        const shopsFromDB = await About.findOne({ param }); // Find the existing data
        shopsFromDB.data = shops; // Update the data
        const updatedShops = await shopsFromDB.save(); // Save the updated data
        return updatedShops; // Return the updated data
    } catch (e) {
        console.log('Error updating shops:', e); // Print error message
    }
}

module.exports = {
    getCoords,
    updateShops
};
