const Client = require("../models/clients");

// Function to handle user login
async function login(username, password) {
    try {
        // Find user by username and password
        const user = await Client.findOne({ username, pass: password });
        if (!user) {
            return { success: false, message: "Incorrect username or password" };
        }
        if (user.isBanned) {
            return { success: false, message: "This user is blocked by the manager" };
        }
        return { success: true, user };
    } catch (e) {
        return { success: false, message: "Login error, please try again later" };
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
        return false;
    }
}

// Function to get user by username
async function getUserByUsername(username) {
    try {
        const user = await Client.findOne({ username });
        return user;
    } catch (e) {
        return null;
    }
}

module.exports = { login, register, getIsManager, getUserByUsername };
