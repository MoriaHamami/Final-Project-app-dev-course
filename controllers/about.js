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
async function getEditAboutPage(req, res) {
    try {
        const coords = await aboutService.getCoords()
        res.render('edit-about.ejs', {coords })
    } catch (e) {
        console.log('e:', e)
    }
}

async function updateShops(req, res){
  // Initialize shops, recieved from the body (in this case, from the ajax req)
  const { shops } = req.body
  try {
    // Send the variable to the about service. There, it will update it in the DB.
    const updatedShops = await aboutService.updateShops(shops)
    res.json(updatedShops)
  }
  catch (e) {
    console.log("Could not save shops")
  }
}

function getCenterCoords(coords) {
    let lats = 0
    let longs = 0
    let latsLength = 0
    let longsLength = 0
    for (let i = 0; i < coords.length; i++) {
        if(coords[i].lat) {
            lats += coords[i].lat
            latsLength++
        }
        if(coords[i].long) {
            longs += coords[i].long
            longsLength++
        }
    }

    const avgLat = latsLength ? lats / latsLength : 37.4220656
    const avgLong = longsLength ? longs / longsLength : -122.0840897

    return {
        lat: avgLat,
        long: avgLong
    }
}

module.exports = {
    getAboutPage,
    getEditAboutPage,
    updateShops
}