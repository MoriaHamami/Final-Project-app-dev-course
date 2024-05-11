const user = require("../models/user")
const loginService=require("../services/login")

function isLoggedIn(req, res, next){    //פונקציה שבודקת האם המשתמש מחובר לאתר ויכול לראות את העמוד שהוא מבקש
    if(req.session.username !=null)
        return next()
    else 
    res.redirect('/login') //אם הוא לא מחובר נעביר אותו לעמוד הלוגאין
}

function private(req,res){
    res.render("private", {username: req.session.username})
}

function loginForm(req,res){res.render("login",{})}
function registerForm(req,res){res.rende("register",{})}

function logout(req,res){
    req.session.destroy(() => {
        res.redirect('/login');
    });
}

async function login (req,res){
    const{username,password} = req.body

    const result =await loginService.login(username,password)
    if(result){
        req.session.username=username 
        res.redirect('/')
    }
    else
    res.redirect('/login?error=1')
}

async function register(req,res){
const {username,password}=req.body

try{
    await loginService.register(username,password)
    req.session.username=username
    res.redirect('/')
}
catch(e){
    res.redirect('/register?error=1')
}
}

module.exports={
    login,
    loginForm,
    register,
    registerForm,
    logout,
    private,
    isLoggedIn,
}