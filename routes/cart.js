const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');

router.route('/')
    .get(cartController.getCartPage);

router.route('/add')
    .post(cartController.addCartItem);

router.route('/remove')
    .post(cartController.removeCartItem);

module.exports = router;