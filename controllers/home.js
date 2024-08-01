// Func renders the home page
function getHomePage(req, res) { 
    res.render('home.ejs', {})
}

function getWeatherApiKey(req, res) { 
    const key = process.env.WEATHER_API
    res.json(key)
}

// Exports function
module.exports = {
    getHomePage,
    getWeatherApiKey
} 
