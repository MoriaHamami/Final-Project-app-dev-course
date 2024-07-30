const express = require('express');
const router = express.Router();
const { getClientPage, getClientOrders } = require('../controllers/client');
const { isLoggedIn } = require('../controllers/login');

const clientController = require("../controllers/client")
const loginController = require("../controllers/login");

router.route('/')
    // TODO: Later only let client with the relevant id enter this page
    // .get(clientController.getClientPage)
    .get(isLoggedIn, getClientPage)

router.route('/canvas-edit')
    // .get(clientController.getEditShirt)
    .get(isLoggedIn, clientController.getEditShirt)

router.route('/:id')
    .get(isLoggedIn, getClientOrders);

module.exports = router;
