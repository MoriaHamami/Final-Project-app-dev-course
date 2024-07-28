// Import Express and create a Router instance
const express = require("express")
const router = express.Router()

// Import the home controller
const homeController = require("../controllers/home")

// Define the route for the home page
router.route('/')
    .get(homeController.getHomePage) // Handle GET requests to the root URL by calling getHomePage from the home controller

// Export the router to be used in other parts of the application
module.exports = router
