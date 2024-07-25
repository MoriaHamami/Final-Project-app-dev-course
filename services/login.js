const Client = require("../models/clients");

async function login(username, password) {
    try {
        const user = await Client.findOne({ username, pass: password });
        return user != null;
    } catch (e) {
        console.error('Login error:', e);
        return false;
    }
}

async function register(fullname, username, password, imgURL) {
    if (!fullname || !username || !password) {
        throw new Error("Missing fullname, username, or password");
    }

    const existingUser = await Client.findOne({ username });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const user = new Client({
        fullname,
        username,
        pass: password,
        imgURL,  // שמירת התמונה כ-Base64
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
        if (!username) return null;
        const user = await Client.findOne({ username });
        return user?.isManager;
    } catch (e) {
        console.error('Error fetching manager status:', e);
        return false;
    }
}

async function getUserByUsername(username) {
    try {
        const user = await Client.findOne({ username });
        return user;
    } catch (e) {
        console.error('Error fetching user:', e);
        return null;
    }
}

module.exports = { login, register, getIsManager, getUserByUsername };



