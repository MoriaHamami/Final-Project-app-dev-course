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

app.use("/products", require("./routes/products"))
app.use("/tickets", require("./routes/tickets"))
app.use(express.static('public'))


app.listen(process.env.PORT);
