const mongoose = require("mongoose")

const Product = new mongoose.Schema({
  title: String,
  color: String,
  cat: String,
  srcImg:[String],
  favePlayer:String,
  price:Number,
  gender:String,
  sizes:[String],
  toDisplay:{
    default:true,
    type:Boolean
  }
})

module.exports = mongoose.model("products", Product)

