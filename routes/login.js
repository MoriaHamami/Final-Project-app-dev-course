const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login");

router.route('/register')
    .get(loginController.registerForm)
    .post(loginController.register);
router.route('/')
    .get(loginController.loginForm)
    .post(loginController.login);
router.route('/logout')
    .get(loginController.logout);
router.get('/', loginController.isLoggedIn, loginController.funcExampleForShowingSecretPage);
// router.route('/home')
//     .get(homeController.getHomePage)



module.exports = router;
