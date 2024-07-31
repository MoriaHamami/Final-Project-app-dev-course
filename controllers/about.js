const newsService = require('../services/news');
const aboutService = require('../services/about');
const loginController = require('./login');

// Get the about page with news and coordinates
const getAboutPage = async (req, res) => {
  try {
    const news = await newsService.getNew(); // Fetch news
    const coords = await aboutService.getCoords(); // Fetch coordinates
    coords.center = getCenterCoords(coords.data); // Calculate center coordinates
    const isManager = await loginController.getIsManager(req, res); // Check if the user is a manager
    res.render('about.ejs', { news, GOOGLE_KEY: process.env.GOOGLE_KEY, coords: coords, isManager });
  } catch (e) {
    res.status(500).json({ error: 'Error fetching news' }); // Handle errors
  }
};

// Calculate the center coordinates from a list of coordinates
function getCenterCoords(coords) {
  let lats = 0;
  let longs = 0;
  let latsLength = 0;
  let longsLength = 0;
  for (let i = 0; i < coords.length; i++) {
    if (coords[i].lat) {
      lats += coords[i].lat;
      latsLength++;
    }
    if (coords[i].long) {
      longs += coords[i].long;
      longsLength++;
    }
  }

  const avgLat = latsLength ? lats / latsLength : 37.4220656; // Default latitude
  const avgLong = longsLength ? longs / longsLength : -122.0840897; // Default longitude

  return {
    lat: avgLat,
    long: avgLong
  };
}

// Create a new news article
const createNew = async (req, res) => {
  const { genre, txt, date } = req.body;
  try {
    const newArticle = await newsService.createNew(genre, txt, date); // Create a new article
    res.json(newArticle); // Send the new article as a response
  } catch (e) {
    res.status(500).json({ error: 'Error creating news' }); // Handle errors
  }
};

// Get a news article by ID
const getNew = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.render('edit-news.ejs', { article: null }); // Render edit page with no article
    }

    const article = await newsService.getNewById(req.params.id); // Fetch article by ID

    if (!article) {
      return res.status(404).json({ error: 'Article not found' }); // Handle article not found
    }

    if (req.path.includes('edit')) {
      return res.render('edit-news.ejs', { article }); // Render edit page with article
    } else {
      return res.redirect('/about'); // Redirect if not editing
    }
  } catch (e) {
    return res.status(500).json({ error: 'Error fetching article' }); // Handle errors
  }
};

const News = require('../models/news');

// Update a news article
const updateNew = async (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  try {
    const article = await News.findById(id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Update only the fields that were sent in the request
    for (let key in updates) {
      if (updates.hasOwnProperty(key)) {
        article[key] = updates[key];
      }
    }

    const savedArticle = await article.save();
    res.json({ success: true, message: 'Article updated successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Error updating article', details: e.message });
  }
};

// Delete a news article
const deleteNew = async (req, res) => {
  try {
    const article = await newsService.deleteArticle(req.params.id); // Delete the article
    if (!article) {
      return res.status(404).json({ error: 'Article not found' }); // If the article was not found
    }
    res.json({ success: true, message: 'Article deleted successfully' }); // Success response
  } catch (e) {
    res.status(500).json({ error: 'Error deleting article' }); // Handle errors
  }
};

// Search for news articles
const searchNews = async (req, res) => {
  const { genre, text } = req.query;

  try {
    const query = {};
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' }; // Search by genre
    }
    if (text) {
      query.txt = { $regex: text, $options: 'i' }; // Search by text
    }

    const news = await newsService.searchNews(query); // Search for news articles
    const isManager = await loginController.getIsManager(req, res); // Check if the user is a manager
    res.render('about', { news, GOOGLE_KEY: process.env.GOOGLE_KEY, coords: req.coords, isManager});
  } catch (e) {
    res.status(500).json({ error: 'Error searching news' }); // Handle errors
  }
};

// Get the edit about page with coordinates
async function getEditAboutPage(req, res) {
  try {
      const coords = await aboutService.getCoords(); // Fetch coordinates
      res.render('edit-about.ejs', {coords }); // Render edit page with coordinates
  } catch (e) {
      console.log('Error:', e); // Handle errors
  }
}

// Update shops data
async function updateShops(req, res) {
  const { shops } = req.body;
  try {
    const updatedShops = await aboutService.updateShops(shops); // Update shops data
    res.json(updatedShops); // Send the updated shops as a response
  } catch (e) {
    console.log("Could not save shops"); // Handle errors
  }
}

module.exports = {
  getAboutPage,
  createNew,
  getNew,
  updateNew,
  deleteNew,
  searchNews,
  updateShops,
  getEditAboutPage
};
