const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clients");

router.route('/')
    .get(clientsController.getClientsPage);

module.exports = router;