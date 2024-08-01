// Load environment variables from .env file
require("dotenv").config(); 

// Load environment variables based on NODE_ENV
require('custom-env').env(process.env.NODE_ENV, './configurations'); 

// Connect to MongoDB
const mongoose = require("mongoose");
mongoose.set('strictQuery', true); // Enable strict mode for queries
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true, // Use new URL parser
  useUnifiedTopology: true // Use new server engine
});

// Import Express and create app
const express = require("express");
const app = express(); // Create Express app

// Set up sessions
const session = require('express-session');
app.use(session({
  secret: process.env.SECRET, // Secret key for sessions
  saveUninitialized: false, // Don't save empty sessions
  resave: false // Don't save unchanged sessions
}));

// Use EJS for templates
const ejs = require('ejs');
app.set("view engine", "ejs"); // Set EJS as template engine

// Set views folder
const path = require('path');
app.set('views', path.join(__dirname, 'views')); // Set folder for templates

// Parse form data
app.use(express.urlencoded({
  extended: false, // Simple query strings
  limit: '50mb' // Increase data limit
}));

// Parse JSON data
app.use(express.json({ limit: '50mb' })); // Increase data limit

// Serve static files
app.use(express.static('public')); // Serve files in public folder

// Define routes
app.use("/", require("./routes/home")); // Home page
app.use("/login", require("./routes/login")); // Login page
app.use("/about", require("./routes/about")); // About page
app.use("/client", require("./routes/client")); // Client page
app.use("/products", require("./routes/products")); // Products page
app.use("/tickets", require("./routes/tickets")); // Tickets page
app.use("/manager", require("./routes/manager")); // Manager page
app.use("/clients", require("./routes/clients")); // Clients page
app.use("/cart", require("./routes/cart")); // Cart page

// Start server
const port = process.env.PORT || 8084; // Set port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`); // Show server start message
});
