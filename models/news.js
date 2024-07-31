const mongoose = require("mongoose");

// Define the schema for news
const NewsSchema = new mongoose.Schema({
  // The genre of the news article
  genre: { type: String, required: true },
  
  // The main text/content of the news article
  txt: { type: String, required: true },
  
  // The date the news article was created, defaulting to the current date/time
  date: { type: Date, default: Date.now }
});

// Export the News model based on the NewsSchema
module.exports = mongoose.model("News", NewsSchema);
