const express = require('express');
const router = express.Router();
const { getClientPage, getClientOrders } = require('../controllers/client');
const { isLoggedIn } = require('../controllers/login');

const clientController = require("../controllers/client");
const loginController = require("../controllers/login");

router.route('/')
    .get(isLoggedIn, getClientPage); // Route for client page, if user is logged in

router.route('/canvas-edit')
    .get(isLoggedIn, clientController.getEditShirt); // Route for editing shirt if user is logged in

router.route('/:id')
    .get(isLoggedIn, getClientOrders); // Route for getting client orders by ID, if user is logged in

module.exports = router;
