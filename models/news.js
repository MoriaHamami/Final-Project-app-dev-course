const mongoose = require("mongoose")

const News = new mongoose.Schema({
  // _id: Number,
  genre:String,
  txt:String,
  date:Date
})

module.exports = mongoose.model("news", News)