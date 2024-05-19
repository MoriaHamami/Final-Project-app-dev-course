const mongoose = require("mongoose")


// TODO : Not sure I did this right
const subSchema = new mongoose.Schema([Number])

const Client = new mongoose.Schema({
  // _id: Number,
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
  cartItems:[Number],
  isBanned:Boolean,
  dateCreated:{ type: Date, default: Date.now },
  isManager:{type:Boolean, default: false}

})

module.exports = mongoose.model("clients", Client)