const express = require("express")
const router = express.Router()

const clientController = require("../controllers/client")
// const loginController = require("../controllers/login");

router.route('/')
    // TODO: Later only let client with the relevant id enter this page
    .get(clientController.getClientPage)
    router.route('/canvas-edit')

    .get(clientController.getEditShirt);
 

module.exports = router