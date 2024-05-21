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
    {
        useNewUrlParser: true,
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

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))

app.use("/", require("./routes/home"))
app.use("/login", require("./routes/login"))
app.use("/products", require("./routes/products"))
app.use(express.static('public'))

// app.use((req, res, next) => {
//     res.header('access-control-allow-origin', `http://localhost:${process.env.PORT}`)
//     res.header('Access-Control-Allow-Credentials', true)
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With')
//     res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
//     res.header('Access-Control-Max-Age', 1728000)
//     if (req.method === 'OPTIONS') {
//       return res.json({ status: 0, message: '', payload: null })
//     }
//     next()
//   })
// app.use(methodOverride('_method'))

// app.use("/", require("./routes/login"));

app.listen(process.env.PORT);
