const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');

console.log("Initializing /cart routes...");

router.route('/')
    .get((req, res, next) => {
        console.log('GET /cart called');
        next();
    }, cartController.getCartPage);

router.route('/add')
    .post(cartController.addCartItem);

router.route('/canvas-edit')
    .post(cartController.addEditShirtToCart);

router.route('/remove')
    .post(cartController.removeCartItem);

module.exports = router;
