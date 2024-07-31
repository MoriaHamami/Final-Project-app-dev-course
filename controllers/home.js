// Func renders the home page
function getHomePage(req, res) { 
    res.render('home.ejs', {})
}

// Exports function
module.exports = {
    getHomePage
} 
