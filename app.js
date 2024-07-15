// DotEnv is a lightweight npm package that automatically loads environment variables 
// from a .env file into the process.env object.
require("dotenv").config()
// Specify which .env file path to use via the path option 
require('custom-env').env(process.env.NODE_ENV, './configurations')

const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const express = require("express");
const app = express();

const session = require('express-session');
app.use(session({
  secret: process.env.SECRET,
  saveUninitialized: false,
  resave: false
}));

const User = require('./models/clients')
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });

  passport.use(new FacebookStrategy({
    clientID: '1781154845712809',
    clientSecret: '0474256b713967ee139d2e591da139b6',
    callbackURL: "http://localhost:8082/facebook/auth/facebook/callback"
  },
    function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({ username: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    ));

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
app.use("/facebook", require("./routes/facebook"))
app.use("/about", require("./routes/about"))
app.use("/client", require("./routes/client"))
app.use("/products", require("./routes/products"))
app.use("/tickets", require("./routes/tickets"))
app.use("/news", require("./routes/news"))
app.use("/clients", require("./routes/clients"))
app.use("/cart", require("./routes/cart"))
app.use(express.static('public'))

const port = process.env.PORT || 8084;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});