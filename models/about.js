const mongoose = require("mongoose")

const subSchema = new mongoose.Schema({
    name: String,
    address: String,
    lat: Number,
    long: Number
})

const About = new mongoose.Schema({
    coords: [subSchema]
})

module.exports = mongoose.model("about", subSchema)





