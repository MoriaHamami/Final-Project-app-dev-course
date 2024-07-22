const Client = require("../models/clients");

async function login(username, password) {
    try {
        const user = await Client.findOne({ username, pass: password });
        return user != null;  // אם המשתמש קיים והסיסמה נכונה, נחזיר true
    } catch (e) {
        console.error('Login error:', e);
        return false;
    }
}

async function register(fullname, username, password, imgURL) {
    if (!fullname || !username || !password) {
        throw new Error("Missing fullname, username, or password");
    }

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await Client.findOne({ username });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const user = new Client({
        fullname,
        username,
        pass: password,
        imgURL,
        spent: 0,
        faveItems: [],
        orders: [],
        cartItems: [],
        isBanned: false,
        isManager: false
    });

    try {
        await user.save();
    } catch (e) {
        console.error('Registration error:', e);
        throw new Error('Error saving user');
    }
}


async function getIsManager(username) {
    try {
        if(!username) return null
        const user = await Client.findOne({ username })
        return user?.isManager 
        // await user.save()
    } catch (e) {
        console.error('Error fetching manager status:', e);
        return false;
    }
}

function isValidEmail(email) {
    // בדיקת תקינות האימייל, כאן תוכל להשתמש בפורמטים או בבדיקות עם רגולריות
    return /\S+@\S+\.\S+/.test(email);
}

module.exports = { login, register, getIsManager };
