// Import Express and create a Router instance
const express = require("express");
const router = express.Router();

// Import the tickets controller
const ticketsController = require("../controllers/tickets");

// Define the route for getting all tickets
router.get('/', ticketsController.getTickets);

// Define the route for getting tickets by filter
router.get('/filter', ticketsController.getTicketsByFilter);

// Define routes for creating and getting a ticket
router.route('/edit')
  .get(ticketsController.getTicket)    // Handle GET requests to get a ticket (no specific ID)
  .post(ticketsController.createTicket); // Handle POST requests to create a new ticket

// Define routes for getting, updating, and deleting a specific ticket by ID
router.route('/edit/:id')
  .get(ticketsController.getTicket)      // Handle GET requests to get a specific ticket by ID
  .put(ticketsController.updateTicket)   // Handle PUT requests to update a specific ticket by ID
  .delete(ticketsController.deleteTicket); // Handle DELETE requests to delete a specific ticket by ID

// Define the route for getting tickets by date
router.get('/date', ticketsController.getTicketsByDate);

// Export the router to be used in other parts of the application
module.exports = router;
