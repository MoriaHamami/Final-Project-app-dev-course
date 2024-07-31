const News = require('../models/news');

// Create a new article
const createNew = async (genre, txt, date) => {
  const newArticle = new News({
    genre,
    txt,
    date
  });
  try {
    return await newArticle.save(); // Save the article and return the result
  } catch (e) {
    return e; // error
  }
};

// Get all news
const getNew = async () => {
  return await News.find({});
};

// Update an existing article by ID
const updateArticle = async (id, genre, txt, date) => {
  const article = await getNewById(id);

  if (!article) return null; // Return null if article is not found

  // Update fields if provided
  if (genre) article.genre = genre;
  if (txt) article.txt = txt;
  if (date) article.date = date;

  try {
    await article.save(); // Save the updated article
    return article;
  } catch (e) {
    return e; // Return the error if saving fails
  }
};

// Delete article by ID
async function deleteArticle(id) {
  try {
    const article = await News.findByIdAndDelete(id);
    return article;
  } catch (e) {
    console.error('Error deleting article:', e);
    throw e;
  }
}


// Fetch article by ID
const getNewById = async (id) => {
  try {
    return await News.findById(id);
  } catch (error) {
    throw error; // Throw error if fetching fails
  }
};

// Search news articles based on a query
const searchNews = async (query) => {
  try {
    return await News.find(query); // Return search results
  } catch (e) {
    throw e; // Throw error if search fails
  }
};

module.exports = {
  createNew,
  getNew,
  updateArticle,
  deleteArticle,
  getNewById,
  searchNews
};
