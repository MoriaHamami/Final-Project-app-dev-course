const About = require('../models/about')

const getCoords = async () => {
    try {
        const coords = await About.find({})
        console.log('coords:', coords)
        return coords
    } catch (e) {
        console.log('e:', e)
    }
}

module.exports = {
    getCoords,
}
