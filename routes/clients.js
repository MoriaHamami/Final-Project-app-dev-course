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


router.route('/edit/:id')
    .delete(clientsController.deleteClient) 
  router.route('/block/:id')
    .patch(clientsController.blockClient); // Change to PATCH for block status update
module.exports = router;
