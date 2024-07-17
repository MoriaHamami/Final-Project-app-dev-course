const Client = require("../models/clients");

async function login(username, password) {
    try {

        const user = await Client.findOne({ username, password })
        return user != null  //if the user correct it will be diffrent than null and return true
        // await user.save()
    } catch (e) {
        return e
    }
}

async function register(username, password) {
    // בדיקת תקינות האימייל
    // if (!isValidEmail(email)) {
    //     throw new Error("Invalid email address");
    // }
    if (!username || !password) {
        throw new Error("Missing username or password")
    }
    
    // Check if you can login the user
    // if(login(username)) throw new Error("User already exists")

    const user = new Client({
        username,
        pass: password
    })

    try {
        await user.save()
    } catch (e) {
        return e
    }
}

async function getIsManager(username) {
    try {
        if(!username) return null
        const user = await Client.findOne({ username })
        return user?.isManager 
        // await user.save()
    } catch (e) {
        return e
    }
}

function isValidEmail(email) {
    // בדיקת תקינות האימייל, כאן תוכל להשתמש בפורמטים או בבדיקות עם רגולריות
    return /\S+@\S+\.\S+/.test(email);
}

module.exports = { login, register, getIsManager }