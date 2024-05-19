const user = require("../models/clients")
const loginService = require("../services/login")

function isLoggedIn(req, res, next) {    //פונקציה שבודקת האם המשתמש מחובר לאתר ויכול לראות את העמוד שהוא מבקש
    if (req.session.username != null)
        return next()
    else
        res.redirect('/login') //אם הוא לא מחובר נעביר אותו לעמוד הלוגאין
}
async function isManagerLoggedIn(req, res, next) {    //פונקציה שבודקת האם המשתמש מחובר לאתר ויכול לראות את העמוד שהוא מבקש
    try {
        const isManager = await loginService.getIsManager(req.session.username)
        console.log('isManager:', isManager)
        if (isManager)
            return next()
        else
            res.json('No permission')
    } catch (e) {
        res.redirect('/login?error=2')
    }

}

function private(req, res) {
    res.render("private", { username: req.session.username })
}

function loginForm(req, res) { res.render("login.ejs", { user: null }) }

function registerForm(req, res) { res.render("register.ejs", { user: null }) }

function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

async function login(req, res) {
    const { username, password } = req.body
    try {

        const result = await loginService.login(username, password)
        if (result) {
            req.session.username = username
            res.redirect('/')
        }
        else
            res.redirect('/login?error=1')
    } catch (e) {
        res.redirect('/login?error=1')
        console.log('e:', e)
    }
}

async function register(req, res) {
    // console.log('req.body:', req.body)
    const { username, password } = req.body

    try {
        await loginService.register(username, password)
        req.session.username = username
        res.redirect('/')
    }
    catch (e) {
        console.log('e:', e)
        // res.redirect('/register?error=1')
    }
}

function funcExampleForShowingSecretPage(req, res) {
    res.render("manager", { username: req.session.username })
}

module.exports = {
    login,
    loginForm,
    register,
    registerForm,
    logout,
    private,
    isLoggedIn,
    funcExampleForShowingSecretPage,
    isManagerLoggedIn
}