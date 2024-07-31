const mongoose = require("mongoose");

// Define sub-schema for orders and cart items
const subSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // Unique ID for the sub-document
    id: mongoose.Schema.Types.ObjectId,  // ID of the related product
    type: String,                        // Type of the item
    size: String                         // Size of the item
});

// Define main schema for clients
const clientSchema = new mongoose.Schema({
    fullname: String,
    username: {                          // Username (required)
        type: String,
        required: true
    },
    pass: {                              // Password (required)
        type: String,
        required: true
    },
    imgURL: String,                      // URL of the client's image
    spent: Number,                       // Amount spent by the client
    faveItems: [{                        // Favorite products
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],
    orders: [[subSchema]],               // Nested orders array
    cartItems: [subSchema],              // Cart items array
    isBanned: { type: Boolean, default: false }, // Ban status
    dateCreated: { type: Date, default: Date.now }, // Creation date
    isManager: { type: Boolean, default: false }   // Manager status
});

// Export the Client model
module.exports = mongoose.model("Client", clientSchema);
