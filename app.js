require("dotenv").config();
require('custom-env').env(process.env.NODE_ENV, './configurations');

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

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

app.use("/", require("./routes/home"));
app.use("/login", require("./routes/login"));
app.use("/about", require("./routes/about")); 
app.use("/clients", require("./routes/clients"));
app.use("/products", require("./routes/products"));
app.use(express.static('public'));

app.listen(process.env.PORT);
