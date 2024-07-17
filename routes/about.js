const express = require("express")
const router = express.Router()

const aboutController = require("../controllers/about")
const loginController = require("../controllers/login");

router.route('/')
    .get(aboutController.getAboutPage)
router.route('/edit')
    .get(aboutController.getEditAboutPage)
    .put(aboutController.updateShops)
    // .get(loginController.isManagerLoggedIn,aboutController.getEditAboutPage)
    // .put(loginController.isManagerLoggedIn,aboutController.updateShops)

module.exports = router