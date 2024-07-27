const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const loginController = require('../controllers/login');

console.log("Initializing /cart routes...");

router.route('/')
    .get((req, res, next) => {
        console.log('GET /cart called');
        next();
    }, cartController.getCartPage);

router.route('/add')
    .post(cartController.addCartItem);
// .get(cartController.getCartPage)

router.route('/canvas-edit')
    .post(cartController.addEditShirtToCart);
// .post(loginController.isLoggedIn, cartController.addEditShirtToCart)

router.route('/remove')
    .post(cartController.removeCartItem);

router.route('/checkout')
    .post(cartController.checkoutCart);  // הוסף את ה-Route החדש לפונקציית ה-checkout

module.exports = router;
