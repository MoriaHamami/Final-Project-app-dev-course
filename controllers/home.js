// Func renders the home page
function getHomePage(req, res) { 
    const key = process.env.GAMES_API
    res.render('home.ejs', {GAMES_API: key})
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
