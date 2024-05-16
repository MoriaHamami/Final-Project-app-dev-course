const mongoose = require("mongoose")

const Product = new mongoose.Schema({
  // _id: Number,
  title: String,
  color: String,
  cat: String,
  srcImg:[String],
  favePlayer:String,
  price:Number,
  gender:String
})

module.exports = mongoose.model("products", Product)

