const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');

// Log to check if routes are being initialized
console.log("Initializing /cart routes...");

router.route('/')
    .get((req, res, next) => {
        console.log('GET /cart called');
        next();
    }, cartController.getCartPage);

router.route('/add')
    .post(cartController.addCartItem);

router.route('/remove')
    .post(cartController.removeCartItem);

module.exports = router;
