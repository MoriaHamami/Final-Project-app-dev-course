const express = require("express")  // Import Express module
const router = express.Router()  // Create a new router object

const productsController = require("../controllers/products")  // Import products controller
const loginController = require("../controllers/login")  // Import login controller

const { isLoggedIn } = loginController  // Import isLoggedIn function

// Route to get all products
router.route('/')
    .get(productsController.getProducts)

// Route to get fave product ids
router.route('/faveIds')
    .get(productsController.getFaveProductIds)

// Route to filter products based on criteria
router.route('/filter')
    .get(productsController.getProductsByFilter)

// Route to get a specific product by ID
router.route('/product/:id')
    .get(productsController.getProduct)

// Route to edit a product by ID, ensuring the manager is logged in
router.route('/edit/:id')
    .get(loginController.isManagerLoggedIn, productsController.getProduct)
    .put(loginController.isManagerLoggedIn, productsController.updateProduct)
    .delete(loginController.isManagerLoggedIn, productsController.deleteProduct)

// Route to create a new product, ensuring the manager is logged in
router.route('/edit')
    .get(loginController.isManagerLoggedIn, productsController.getProduct)
    .post(loginController.isManagerLoggedIn, productsController.createProduct)

// Route to toggle a product in the wishlist, ensuring the user is logged in
router.post('/toggle-wishlist', isLoggedIn, productsController.toggleWishlist)

module.exports = router  // Export the router
