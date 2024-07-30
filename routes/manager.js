const express = require("express")
const router = express.Router()

const managerController = require("../controllers/manager")
const loginController = require("../controllers/login")

router.route('/')
    .get(loginController.isManagerLoggedIn, managerController.getManagerPage)
router.route('/getStats')
    .get(loginController.isManagerLoggedIn, managerController.getStats)
    // .get(managerController.getManagerPage)
    router.route('/edit-facebook')
        .get(loginController.isManagerLoggedIn, managerController.getFacebookEditPage)
        .post(loginController.isManagerLoggedIn, managerController.facebookPost)

module.exports = router