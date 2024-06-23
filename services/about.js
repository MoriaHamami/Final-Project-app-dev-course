const About = require('../models/about')

const getCoords = async () => {
    try {
        const param = 'coords'
        const coords = await About.findOne({param})
        return coords
    } catch (e) {
        console.log('e:', e)
    }
}

module.exports = {
    getCoords,
}
