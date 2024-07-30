// Import express and create a router instance
const express = require('express');
const router = express.Router();

// Import the cart and login controllers
const cartController = require('../controllers/cart');
const loginController = require('../controllers/login');

// Define the route for the cart page with a middleware that calls the next handler
router.route('/')
    // .get((req, res, next) => {
    //     next();
    // }, cartController.getCartPage);
    .get(loginController.isLoggedIn, cartController.getCartPage) // הערה קיימת

// Define the route to add an item to the cart
router.route('/add')
    // .post(cartController.addCartItem);
    .post(loginController.isLoggedIn, cartController.addCartItem) // הערה קיימת
// .get(cartController.getCartPage) // הערה קיימת

// Define the route to add or edit a shirt in the cart via canvas-edit
router.route('/canvas-edit')
    // .post(cartController.addEditShirtToCart);
    .post(loginController.isLoggedIn, cartController.addEditShirtToCart) // הערה קיימת

// Define the route to remove an item from the cart
router.route('/remove')
    // .post(cartController.removeCartItem);
    .post(loginController.isLoggedIn, cartController.removeCartItem)

// Define the route for checking out the cart
router.route('/checkout')
    // .post(cartController.checkoutCart); 
    .post(loginController.isLoggedIn, cartController.checkoutCart)

// Export the router to be used in other parts of the application
module.exports = router;
