const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    fullname: String,
    username: {
        type: String,
        required: true
    },
    pass: {
        type: Number,
        required: true
    },
    imgURL: String,
    spent: Number,
    faveItems: [Number],
    orders: [[Number]], // סוג נתונים של מערך של מערכים של מזהה מוצר
    cartItems: [Number],
    isBanned: Boolean,
    dateCreated: { type: Date, default: Date.now },
    isManager: { type: Boolean, default: false }
});

module.exports = mongoose.model("Client", clientSchema);
