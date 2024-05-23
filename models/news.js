const mongoose = require("mongoose")

const News = new mongoose.Schema({
  genre:String,
  txt:String,
  date:Date
})

module.exports = mongoose.model("news", News)