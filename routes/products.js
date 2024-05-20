const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products")
const loginController = require("../controllers/login");

router.route('/edit/:id')
    .get( productsController.getProduct)
    // .get(loginController.isManagerLoggedIn, productsController.getProduct)
    .put( productsController.updateProduct)
    // .put(loginController.isManagerLoggedIn, productsController.updateProduct)
    // .delete(productsController.deleteProduct)
    .delete(loginController.isManagerLoggedIn, productsController.deleteProduct)
router.route('/edit')
    .get( productsController.getProduct)
    // .get(loginController.isManagerLoggedIn, productsController.getProduct)
    // .post( productsController.createProduct)
    .post( productsController.createProduct)
    // .post(loginController.isManagerLoggedIn, productsController.createProduct)
router.route('/product/:id')
    .get(productsController.getProduct)
router.route('/')
    .get(productsController.getProducts)

module.exports = router;

