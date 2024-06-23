const aboutService = require('../services/about');

// Func renders the about page
async function getAboutPage(req, res) {
    try {
        const coords = await aboutService.getCoords()
        coords.center = getCenterCoords(coords.data)
        res.render('about.ejs', { GOOGLE_KEY: process.env.GOOGLE_KEY, coords: coords })
    } catch (e) {
        console.log('e:', e)
    }
}

function getCenterCoords(coords) {
    let lats = 0
    let longs = 0
    for (let i = 0; i < coords.length; i++) {
        lats += coords[i].lat
        longs += coords[i].long
    }

    const avgLat = lats ? lats / coords.length : 37.4220656
    const avgLong = longs ? longs / coords.length : -122.0840897

    return {
        lat: avgLat,
        long: avgLong
    }
}

module.exports = {
    getAboutPage
}