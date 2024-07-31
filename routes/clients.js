// Import Express and create a Router instance
const express = require("express");
const router = express.Router();

// Import the clients and login controllers
const clientsController = require("../controllers/clients");
const loginController = require("../controllers/login");

// Define the route for the clients page
router.route('/')
    // .get(clientsController.getClientsPage);
    .get(loginController.isManagerLoggedIn, clientsController.getClientsPage); // checking if the manager is logged in

// Define the route for getting client orders by client ID
router.route('/:id')
    // .get(clientsController.getClientOrders);
    .get(loginController.isManagerLoggedIn, clientsController.getClientOrders); // checking if the manager is logged in

// Define the route for deleting a client by ID
router.route('/edit/:id')
    // .delete(clientsController.deleteClient);
    .delete(loginController.isManagerLoggedIn, clientsController.deleteClient);

// Define the route for blocking client by ID
router.route('/block/:id')
    // .patch(clientsController.blockClient);
    .patch(loginController.isManagerLoggedIn, clientsController.blockClient);

// Export the router
module.exports = router;
