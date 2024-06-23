const mongoose = require("mongoose")

const Ticket = new mongoose.Schema({
  // _id: Number,
  title: String,
  price: Number,
  stadium: String,
  opImg: String,
  opponent: String,
  date: Date
})

module.exports = mongoose.model("tickets", Ticket)

