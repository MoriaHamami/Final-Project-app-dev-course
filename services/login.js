const User= require("../models/user");

async function login(username,password){
    const user= await User.findOne({_id: username,password });
    return user !=null  //if the user correct it will be diffrent fron null and return true
}

async function register(username, password, email) {
    // בדיקת תקינות האימייל
    if (!isValidEmail(email)) {
        throw new Error("Invalid email address");
    }

    const user = new User({
        _id: username,
        password,
        email
    });

    await user.save();
}

function isValidEmail(email) {
    // בדיקת תקינות האימייל, כאן תוכל להשתמש בפורמטים או בבדיקות עם רגולריות
    return /\S+@\S+\.\S+/.test(email);
}

 
module.exports={login,register}