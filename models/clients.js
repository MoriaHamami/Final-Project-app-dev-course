const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    type: String,
    size: String
});

const clientSchema = new mongoose.Schema({
    fullname: String,
    username: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    imgURL: String,
    spent: Number,
    faveItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    orders: [[subSchema]], // מערך של מערכים של אובייקטים מסוג subSchema
    cartItems: [subSchema],
    isBanned: Boolean,
    dateCreated: { type: Date, default: Date.now },
    isManager: { type: Boolean, default: false }
});

module.exports = mongoose.model("Client", clientSchema);