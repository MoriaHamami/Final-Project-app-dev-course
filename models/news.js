const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema({
  genre: { type: String, required: true },
  txt: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("News", NewsSchema);
