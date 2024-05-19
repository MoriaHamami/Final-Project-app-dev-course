function getHomePage(req, res) {    //פונקציה שבודקת האם המשתמש מחובר לאתר ויכול לראות את העמוד שהוא מבקש
    // if (req.session.username != null)
        res.render('home.ejs', {})
    //     else
    // res.redirect('/login') //אם הוא לא מחובר נעביר אותו לעמוד הלוגאין
}

module.exports = {
    getHomePage
}