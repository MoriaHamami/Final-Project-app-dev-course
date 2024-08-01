const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/about");
const loginController = require("../controllers/login");

// Route for the main about page
router.route('/')
  .get(aboutController.getAboutPage) // Show the about page
  .post(loginController.isManagerLoggedIn, aboutController.createNew); // Create a new article, only if the user is a manager

// Route for editing shops information
router.route('/edit-shops')
  .get(loginController.isManagerLoggedIn, aboutController.getEditAboutPage) // Show edit page, only if the user is a manager
  .put(loginController.isManagerLoggedIn, aboutController.updateShops); // Update shop info, only if the user is a manager

// Route for editing news articles
router.route('/edit')
  .get(loginController.isManagerLoggedIn, (req, res) => {
    res.render('edit-news.ejs', { article: null }); // Show the edit news page with no article
  })
  .post(loginController.isManagerLoggedIn, aboutController.createNew); // Create a new article, only if the user is a manager

// Route for handling specific news article by ID
router.route('/edit/:id')
  .get(loginController.isManagerLoggedIn, aboutController.getNew) // Show article by ID, only if the user is a manager
  .put(loginController.isManagerLoggedIn, aboutController.updateNew) // Update article by ID, only if the user is a manager
  .delete(loginController.isManagerLoggedIn, aboutController.deleteNew); // Delete article by ID, only if the user is a manager

// Route for searching news articles
router.route('/search')
  .get(aboutController.searchNews); // Search for news articles based on query parameters

module.exports = router;
