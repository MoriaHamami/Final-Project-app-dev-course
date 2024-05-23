const mongoose = require("mongoose")

const Product = new mongoose.Schema({
  title: String,
  color: String,
  cat: String,
  srcImg:[String],
  favePlayer:String,
  price:Number,
  gender:String,
  sizes:[String]
})

module.exports = mongoose.model("products", Product)

