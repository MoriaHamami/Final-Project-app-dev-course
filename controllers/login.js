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

// Check if a user is logged in
function isLoggedIn(req, res, next) {
    if (req.session.username != null) {
        return next();
    } else {
        res.redirect('/login');
    }
}

async function isManagerLoggedIn(req, res, next) {
    try {
        const isManager = await loginService.getIsManager(req.session.username);
        if (isManager) {
            return next();
        } else {
            res.redirect('/login');
        }
    } catch (e) {
        console.log('e:', e);
    }
}

function logout(req, res) {
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

async function login(req, res) {
    const { username, password } = req.body;
    try {
        const result = await loginService.login(username, password);
        if (result) {
            req.session.username = username;
            res.redirect('/');
        } else {
            res.render("login.ejs", { user: null, error: "שם משתמש או סיסמה לא נכונים" });
        }
    } catch (e) {
        console.log('e:', e);
        res.render("login.ejs", { user: null, error: "שגיאה בהתחברות, נסה שוב מאוחר יותר" });
    }
}



async function register(req, res) {
    const { fullname, username, password, imgURL } = req.body;

    try {
        const existingUser = await loginService.getUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: "שם משתמש זה כבר קיים. נסה שם משתמש אחר" });
        }

        await loginService.register(fullname, username, password, imgURL);
        req.session.username = username;
        res.status(201).json({ message: "נרשמת בהצלחה!" });
    } catch (e) {
        console.log('e:', e);
        res.status(500).json({ error: "שגיאה ברישום, נסה שוב מאוחר יותר" });
    }
}



// פונקציות נוספות שלא יימחקו
function funcExampleForShowingSecretPage(req, res) {
    res.render("manager", { username: req.session.username });
}

async function getUsername(req, res) {
    return req.session.username;
}

async function getPermissions(req, res) {
    try {
        if (!req.session.username) return res.json({ user: null });
        const isManager = await loginService.getIsManager(req.session.username);
        const user = { isManager };
        console.log('user:', user);
        res.json(user);
    } catch (e) {
        res.json({ user: null });
    }
}

async function getIsManager(req, res) {
    try {
        const isManager = await loginService.getIsManager(req.session?.username);
        return isManager;
    } catch (e) {
        console.log('e:', e);
    }
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
    getIsManager,
    getClientPage,
    getPermissions
};
