const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clients");
const loginController = require("../controllers/login");

router.route('/')
    .get(clientsController.getClientsPage);
    // .get(loginController.isManagerLoggedIn,clientsController.getClientsPage);
router.route('/:id')
    .get(clientsController.getClientOrders);
    // .get(loginController.isManagerLoggedIn,clientsController.getClientOrders);


module.exports = router;
