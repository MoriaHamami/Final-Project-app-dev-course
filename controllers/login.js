const loginService = require("../services/login");
const clientsService = require('../services/clients');

// Render login page
function loginForm(req, res) { 
    res.render("login.ejs", { user: null }); 
}

// Render register page
function registerForm(req, res) { 
    res.render("register.ejs", { user: null }); 
}

// Check if a user is logged in
function isLoggedIn(req, res, next) {
    // Check if a user is logged in on session storage   
    if (req.session.username != null) {
        // If a user is logged in , 
        // go on to the next func asked in the routes file
        return next();
    } else {
        // If a user isnt logged in, send to login page
        res.redirect('/login');
    }
}

async function isManagerLoggedIn(req, res, next) {
    try {
        // Check if the manager is logged in by key isManager in DB
        const isManager = await loginService.getIsManager(req.session.username);
        // If the user is a manager, 
        // go on to the next func asked in the routes file
        if (isManager) {
            return next();
        } else {
            // If the user isnt a manager, send to login page
            res.redirect('/login');
        }
    } catch (e) {
        // TODO: Later make a route to an error page
        // res.redirect('/login?error=2')
        console.log('e:', e);
    }
}

function logout(req, res) {
    // Delete the cookie, so the user wont be saved in session
    req.session.destroy(() => {
        // Then send the user to the login page
        res.redirect('/login');
    });
}

async function login(req, res) {
    // Get values from input in ejs file (save on body obj)
    const { username, password } = req.body;
    try {
        // Check if user exists in DB 
        const result = await loginService.login(username, password);
        if (result) {
            // Save in cookies the username 
            // (so that with each page refresh, the user will still be remembered)
            req.session.username = username;
            // After updating logged in user, render homepage
            res.redirect('/');
        }
        // TODO: Later make a route to an error page
        // else
        // res.redirect('/login?error=1')
    } catch (e) {
        // TODO: Later make a route to an error page
        // res.redirect('/login?error=1')
        console.log('e:', e);
    }
}

async function register(req, res) {
    // Get values from input in ejs file (save on body obj)
    const { username, password } = req.body;

    try {
        // Add user to DB
        await loginService.register(username, password);
        // Save in cookies the username 
        // (so that with each page refresh, the user will still be remembered)
        req.session.username = username;
        // After adding new user, go to homepage
        res.redirect('/');
    } catch (e) {
        console.log('e:', e);
        // TODO: Later make a route to an error page
        // res.redirect('/register?error=1')
    }
}

// TODO: Later add this function for pages that need the user
function funcExampleForShowingSecretPage(req, res) {
    res.render("manager", { username: req.session.username });
}

async function getUsername(req, res) {
    return req.session.username;
}

const getClientPage = async (req, res) => {
    try {
        const username = req.session.username;
        const clientInfo = await clientsService.getClientByUsername(username);
        if (!clientInfo) {
            return res.status(404).send('Client not found');
        }
        res.render('client', { client: clientInfo });
    } catch (e) {
        console.error('Error fetching client:', e);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    login,
    loginForm,
    register,
    registerForm,
    logout,
    isLoggedIn,
    funcExampleForShowingSecretPage,
    isManagerLoggedIn, 
    getUsername,
    getClientPage
};
