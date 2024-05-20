// Func renders the home page
function getHomePage(req, res) {
    res.render('home.ejs', {})
}

module.exports = {
    getHomePage
}