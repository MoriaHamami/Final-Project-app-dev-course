const mongoose = require("mongoose");

const subSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId, 
    type: String, 
    size: String
})

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
    orders: [[subSchema]], // סוג נתונים של מערך של מערכים של מזהה מוצר
    cartItems: [subSchema],
    // orders: [[Number]], // סוג נתונים של מערך של מערכים של מזהה מוצר
    // cartItems: [mongoose.Schema.Types.ObjectId],
    isBanned: Boolean,
    dateCreated: { type: Date, default: Date.now },
    isManager: { type: Boolean, default: false }
});

module.exports = mongoose.model("Client", clientSchema);
