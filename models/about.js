const mongoose = require("mongoose")

const subSchema = new mongoose.Schema({
    name: String,
    address: String,
    lat: Number,
    long: Number
})

const About = new mongoose.Schema({
    data: [subSchema]
},{
    // Without this line mongoose creates a new empty collection of "abouts"  
    collection:"about"
})

module.exports = mongoose.model("about", About)





