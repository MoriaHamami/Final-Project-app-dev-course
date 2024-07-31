const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/about");
const loginController = require("../controllers/login");

// Route for the main about page
router.route('/')
  .get(aboutController.getAboutPage) // Show the about page
  // .post(aboutController.createNew); // Create a new article (commented out)
  .post(loginController.isManagerLoggedIn, aboutController.createNew); // Create a new article, only if the user is a manager

// Route for editing shops information
router.route('/edit-shops')
  // .get(aboutController.getEditAboutPage) // Show the page to edit shop info (commented out)
  .get(loginController.isManagerLoggedIn, aboutController.getEditAboutPage) // Show edit page, only if the user is a manager
  // .put(aboutController.updateShops) // Update shop info (commented out)
  .put(loginController.isManagerLoggedIn, aboutController.updateShops); // Update shop info, only if the user is a manager

// Route for editing news articles
router.route('/edit')
  // .get((req, res) => { res.render('edit-news.ejs', { article: null }) }) // Show edit news page (commented out)
  // .post(aboutController.createNew) // Create a new article (commented out)
  .get(loginController.isManagerLoggedIn, (req, res) => {
    res.render('edit-news.ejs', { article: null }); // Show the edit news page with no article
  })
  .post(loginController.isManagerLoggedIn, aboutController.createNew); // Create a new article, only if the user is a manager

// Route for handling specific news article by ID
router.route('/edit/:id')
  // .get(aboutController.getNew) // Show specific article (commented out)
  // .put(aboutController.updateNew) // Update specific article (commented out)
  // .delete(aboutController.deleteNew) // Delete specific article (commented out)
  .get(loginController.isManagerLoggedIn, aboutController.getNew) // Show article by ID, only if the user is a manager
  .put(loginController.isManagerLoggedIn, aboutController.updateNew) // Update article by ID, only if the user is a manager
  .delete(loginController.isManagerLoggedIn, aboutController.deleteNew); // Delete article by ID, only if the user is a manager

// Route for searching news articles
router.route('/search')
  .get(aboutController.searchNews); // Search for news articles based on query parameters

module.exports = router;
