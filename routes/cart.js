// Import necessary modules
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart");

// Handle routes for '/tickets'
router.route('/')
    .get(cartController.getCartPage)



module.exports = router;