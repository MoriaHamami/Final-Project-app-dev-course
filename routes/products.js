const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products")

router.route('/edit/:id')
    .get(productsController.getProduct)
    .patch(productsController.updateProduct)
router.route('/edit')
    .get(productsController.getProduct)
    .post(productsController.createProduct)
router.route('/product/:id')
    .get(productsController.getProduct)
router.route('/')
    .get(productsController.getProducts)

module.exports = router;

