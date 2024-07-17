const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clients");

router.route('/')
    .get(clientsController.getClientsPage);
router.route('/:id')
    .get(clientsController.getClientOrders);
router.route('/edit/:id')
    .delete( clientsController.deleteClient)
module.exports = router;
