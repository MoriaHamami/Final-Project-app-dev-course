// DotEnv is a lightweight npm package that automatically loads environment variables 
// from a .env file into the process.env object.
require("dotenv").config()
// Specify which .env file path to use via the path option 
require('custom-env').env(process.env.NODE_ENV, './config')

// Mongoose is a MongoDB object modeling tool that works in an async env. 
// Mongoose supports Node.js
const mongoose = require("mongoose")
// The strict option, ensures that values passed to our model that were not specified in our schema do not get saved to the db.
mongoose.set('strictQuery', true)
// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING,
    {
        // Allows us to fall back to the old parser if we find a bug in the new parser
        useNewUrlParser: true,
        // Adds the ability to use the MongoDB driver's new connection management engine
        useUnifiedTopology: true
    })

// Express is a minimal and flexible Node.js web application framework that provides a wide set of features for web apps.
const express = require("express")
// Execute the express function 
const app = express()

// express-session provides a simple API for creating, reading, and updating session data (cookies)
const session = require('express-session')
app.use(session({
    // Allows express-session to use the secret (saved in config) to encrypt the sessionId
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false
}))

// Set EJS as the view engine for the Express application
app.set("view engine", "ejs")
app.use(express.urlencoded({
    extended: false,
    // Increase the request size limit
    limit: '50mb'
}))
// Increase the request size limit
app.use(express.json({ limit: '50mb' }))

// For each route, send to the relevant file (which will handle the req/res)
app.use("/", require("./routes/home"))
app.use("/login", require("./routes/login"))
app.use("/products", require("./routes/products"))
app.use(express.static('public'))

// Start listening for visitors on our specific port (shown in config file)
app.listen(process.env.PORT)
