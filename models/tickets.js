const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  stadium: { type: String, required: true },
  opImg: { type: String, required: true },
  opponent: { type: String, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model("Ticket", TicketSchema);
