const mongoose = require("mongoose")

const Ticket = new mongoose.Schema({
  title:String,
  price:Number,
  stadium:String,
  opImg:String,
  opponent:String,
  date:Date
})

module.exports = mongoose.model("tickets", Ticket)