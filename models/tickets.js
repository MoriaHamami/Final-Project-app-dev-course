const mongoose = require("mongoose");

// Define the schema for a Ticket
const Ticket = new mongoose.Schema({
  title: String,    // Title of the ticket
  price: Number,    // Price of the ticket
  stadium: String,  // Stadium 
  opImg: String,    //opponent team image
  opponent: String, //opponent team
  date: Date        // Date
});

// Export the Ticket model based on the schema
module.exports = mongoose.model("tickets", Ticket);
