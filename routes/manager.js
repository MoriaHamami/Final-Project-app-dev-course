const express = require("express")  // Import Express module
const router = express.Router()  // Create a new router object

const managerController = require("../controllers/manager")  // Import manager controller
const loginController = require("../controllers/login")  // Import login controller

// Route to get the manager page, ensuring the manager is logged in
router.route('/')
    .get(loginController.isManagerLoggedIn, managerController.getManagerPage)

// Route to get manager statistics, ensuring the manager is logged in
router.route('/getStats')
    .get(loginController.isManagerLoggedIn, managerController.getStats)

// Route to edit Facebook page, ensuring the manager is logged in
router.route('/edit-facebook')
    .get(loginController.isManagerLoggedIn, managerController.getFacebookEditPage)
    .post(loginController.isManagerLoggedIn, managerController.facebookPost)

module.exports = router  // Export the router
