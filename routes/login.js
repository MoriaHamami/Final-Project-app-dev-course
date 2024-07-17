const express = require("express")
const router = express.Router()

const loginController = require("../controllers/login")

//  For each route recieved, check method requested and send to relevant controller
router.route('/')
.get(loginController.loginForm)
.post(loginController.login)
router.route('/register')
    .get(loginController.registerForm)
    .post(loginController.register)
router.route('/logout')
    .get(loginController.logout)
// For later use:
// router.get('/', loginController.isLoggedIn, loginController.funcExampleForShowingSecretPage);


module.exports = router
