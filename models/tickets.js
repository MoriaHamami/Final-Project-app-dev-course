const mongoose = require("mongoose");

// Define the schema for a Ticket
const Ticket = new mongoose.Schema({
  title:  String ,
  price:  Number ,
  stadium:  String ,
  opImg:  String ,
  opponent:  String ,
  date:  Date 
});

// Export the Ticket model based on the schema
module.exports = mongoose.model("tickets", Ticket);
