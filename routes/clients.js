const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clients");

router.route('/')
    .get(clientsController.getClientsPage);
router.route('/:id')
    .get(clientsController.getClientOrders);
router.route('/edit/:id')
    .delete(clientsController.deleteClient) 
  router.route('/block/:id')
    .patch(clientsController.blockClient); // Change to PATCH for block status update
module.exports = router;
