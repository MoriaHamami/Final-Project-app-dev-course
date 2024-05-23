const mongoose = require("mongoose")

// Create another mini scheme to represent an array of numbers
// (for later use in the orders key which includes the following val:
// arrays of arrays of product ids)
// TODO: Make the subscheme works
const subSchema = new mongoose.Schema([Number])
// const subSchema = new mongoose.Schema([mongoose.Schema.ObjectId])

const Client = new mongoose.Schema({
  fullname:String,
  username: {
    type: String,
    required: true
  },
  pass:{
    type: Number,
    required: true
  },
  imgURL:String,
  spent: Number,
  faveItems:[Number],
  orders:[
   subSchema
  ],
  // EX: [[0,2,5], [1, 2, 7]]
  cartItems:[Number],
  isBanned:Boolean,
  dateCreated:{ type: Date, default: Date.now },
  isManager:{type:Boolean, default: false}

})

module.exports = mongoose.model("clients", Client)