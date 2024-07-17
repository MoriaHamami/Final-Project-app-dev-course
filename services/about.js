const About = require('../models/about')

const getCoords = async () => {
    try {
        const param = 'shops'
        const coords = await About.findOne({ param })
        return coords
    } catch (e) {
        console.log('e:', e)
    }
}

async function updateShops(shops) {
    if (!shops)
        return null
    try {
        const param = 'shops'
        const shopsFromDB = await About.findOne({ param })
        shopsFromDB.data = shops
        const updatedShops = await shopsFromDB.save()
        return updatedShops
    } catch (e) {
        console.log('e:', e)
    }
}

module.exports = {
    getCoords,
    updateShops
}
