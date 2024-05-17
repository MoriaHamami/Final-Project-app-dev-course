// const express = require('express')
// const articlesRoutes = require('./routes/articles')
// // Create the server
// const server = express()

// // Static folder called public 
// // will be given if nothing else is requested
// server.use(express.static('public'))

// server.use("/", articlesRoutes)

// server.listen(80)



// var methodOverride = require('method-override')

// With node.js you can use a tool called "devcert" to have https on localhost.
require("dotenv").config();

require('custom-env').env(process.env.NODE_ENV, './config');

const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNECTION_STRING, 
    {   useNewUrlParser: true, 
        useUnifiedTopology: true
    });

const express = require("express");
const app = express();

const session = require('express-session');
app.use(session({
    secret: 'foo',    
    saveUninitialized: false,
    resave: false
}))

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));  
app.use("/products", require("./routes/products"));
app.use(express.static('public'))
// app.use(methodOverride('_method'))

// app.use("/", require("./routes/login"));

app.listen(process.env.PORT);
