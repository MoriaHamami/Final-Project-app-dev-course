// Import express and create a router instance
const express = require('express');
const router = express.Router();

// Import the cart and login controllers
const cartController = require('../controllers/cart');
const loginController = require('../controllers/login');

// Define the route for the cart page with a middleware that checks if the user is logged in
router.route('/')
    .get(loginController.isLoggedIn, cartController.getCartPage) // Check if the user is logged in before 

// Define the route to add an item to the cart
router.route('/add')
    .post(loginController.isLoggedIn, cartController.addCartItem) // Check if the user is logged in before

// Define the route to add or edit a shirt
router.route('/canvas-edit')
    .post(loginController.isLoggedIn, cartController.addEditShirtToCart) // Check if the user is logged in before 

// Define the route to remove an item from the cart
router.route('/remove')
    .post(loginController.isLoggedIn, cartController.removeCartItem) // Check if the user is logged in before

// Define the route for checking out the cart
router.route('/checkout')
    .post(loginController.isLoggedIn, cartController.checkoutCart) // Check if the user is logged in before 

// Define the route for checking out the cart
router.route('/cartItems')
    .get(loginController.isLoggedIn, cartController.getCartItems) // Check if the user is logged in before 


module.exports = router;
