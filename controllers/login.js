const loginService = require("../services/login");
const clientsService = require('../services/clients');

// Render login page
function loginForm(req, res) {
    res.render("login.ejs", { user: null, error: null });
}

// Render register page
function registerForm(req, res) {
    res.render("register.ejs", { user: null });
}

// Middleware to check if a user is logged in
function isLoggedIn(req, res, next) {
    if (req.session.username != null) {
        return next();
    } else {
        if (req.xhr) {
            // If the request is via AJAX, return a JSON response
            res.status(401).json({ success: false, message: 'You need to log in first to add to favorites.' });
        } else {
            // Otherwise, redirect to the login page
            res.redirect('/login');
        }
    }
}

// Middleware to check if a manager is logged in
async function isManagerLoggedIn(req, res, next) {
    try {
        const isManager = await loginService.getIsManager(req.session.username);
        if (isManager) {
            return next();
        } else {
            res.redirect('/login');
        }
    } catch {
        res.redirect('/login');
    }
}

// Logout function
function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

// Login function
async function login(req, res) {
    const { username, password } = req.body;
    try {
        const result = await loginService.login(username, password);
        if (result.success) {
            req.session.username = username; // Save username in session
            res.redirect('/');
        } else {
            res.render("login.ejs", { user: null, error: result.message });
        }
    } catch {
        res.render("login.ejs", { user: null, error: "Login error, please try again later" });
    }
}

// Register function
async function register(req, res) {
    const { fullname, username, password, imgURL } = req.body;
    try {
        const existingUser = await loginService.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "This username already exists. Please choose another username" });
        }

        await loginService.register(fullname, username, password, imgURL);
        req.session.username = username;
        res.status(201).json({ message: "Successfully registered!" });
    } catch {
        res.status(500).json({ error: "Registration error, please try again later" });
    }
}

// Example function for showing a secret page
function funcExampleForShowingSecretPage(req, res) {
    res.render("manager", { username: req.session.username });
}

// Get username from session
async function getUsername(req, res) {
    return req.session.username;
}

// Get permissions for a user
async function getPermissions(req, res) {
    try {
        if (!req.session.username) return res.json({ user: null });
        const isManager = await loginService.getIsManager(req.session.username);
        const user = { isManager };
        res.json(user);
    } catch {
        res.json({ user: null });
    }
}

// Check if the user is a manager
async function getIsManager(req, res) {
    try {
        const isManager = await loginService.getIsManager(req.session?.username);
        return isManager;
    } catch {
        return false;
    }
}

// Get client page
const getClientPage = async (req, res) => {
    try {
        const username = req.session.username;
        const clientInfo = await clientsService.getClientByUsername(username);
        if (!clientInfo) {
            return res.status(404).send('Client not found');
        }
        res.render('client', { client: clientInfo });
    } catch {
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
    getIsManager,
    getClientPage,
    getPermissions
};
