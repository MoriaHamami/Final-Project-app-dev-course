const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products");
const loginController = require("../controllers/login");

// ייבוא הפונקציה isLoggedIn מהקובץ של loginController
const { isLoggedIn } = loginController; // ייבוא isLoggedIn בצורה נכונה

//  For each route received, check method requested and send to relevant controller
router.route('/')
    .get(productsController.getProducts);

router.route('/filter')
    .get(productsController.getProductsByFilter);

router.route('/product/:id')
    .get(productsController.getProduct);

router.route('/edit/:id')
    // .get(productsController.getProduct)
    .get(loginController.isManagerLoggedIn, productsController.getProduct)
    // .put(productsController.updateProduct)
    .put(loginController.isManagerLoggedIn, productsController.updateProduct)
    // .delete(productsController.deleteProduct);
    .delete(loginController.isManagerLoggedIn, productsController.deleteProduct)

router.route('/edit')
    // .get(productsController.getProduct)
    .get(loginController.isManagerLoggedIn, productsController.getProduct)
    // .post(productsController.createProduct);
    .post(loginController.isManagerLoggedIn, productsController.createProduct)

// נתיב להוספת והסרת מוצרים מרשימת המשאלות עם פונקציית isLoggedIn
router.post('/toggle-wishlist', isLoggedIn, productsController.toggleWishlist);

module.exports = router;
