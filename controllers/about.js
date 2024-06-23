const aboutService = require('../services/about');

// Func renders the about page
async function getAboutPage(req, res) {
    try {
        const coords = await aboutService.getCoords()
        res.render('about.ejs', { GOOGLE_KEY: process.env.GOOGLE_KEY, coords })
    } catch (e) {
        console.log('e:', e)
    }
}

module.exports = {
    getAboutPage
}