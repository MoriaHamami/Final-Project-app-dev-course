const mongoose = require("mongoose");

// Define the sub-schema for location details
const subSchema = new mongoose.Schema({
    name: String,
    address: String,
    lat: Number,
    long: Number
});

// Define the main schema for 'About' with an array of sub-schemas
const About = new mongoose.Schema({
    _id: String, // Unique identifier for each document
    data: [subSchema] // Array of location details
}, {
    // Without this line mongoose creates a new empty collection of "abouts"  
    collection: "about"
});

// Export the model based on the 'About' schema
module.exports = mongoose.model("about", About);



