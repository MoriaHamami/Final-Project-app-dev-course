const Client = require("../models/clients");

// Function to handle user login
async function login(username, password) {
    try {
        // Find user by username and password
        const user = await Client.findOne({ username, pass: password });
        return user != null;
    } catch (e) {
        console.error('Login error:', e);
        return false;
    }
}

// Function to handle user registration
async function register(fullname, username, password, imgURL) {
    // Check if required fields are provided
    if (!fullname || !username || !password) {
        throw new Error("Missing fullname, username, or password");
    }

    // Check if user already exists
    const existingUser = await Client.findOne({ username });
    if (existingUser) {
        throw new Error("User already exists");
    }

    // Create new user
    const user = new Client({
        fullname,
        username,
        pass: password,
        imgURL,  // Save image as Base64
        spent: 0,
        faveItems: [],
        orders: [],
        cartItems: [],
        isBanned: false,
        isManager: false
    });

    try {
        // Save user to database
        await user.save();
    } catch (e) {
        console.error('Registration error:', e);
        throw new Error('Error saving user');
    }
}

// Function to check if a user is a manager
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

// Function to get user by username
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
