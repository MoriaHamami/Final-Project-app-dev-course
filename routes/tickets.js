// Import Express and create a Router instance
const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");

// Import the tickets controller
const ticketsController = require("../controllers/tickets");

// route for getting all tickets
router.get('/', ticketsController.getTickets);

//  route for getting tickets by filter
router.get('/filter', ticketsController.getTicketsByFilter);

//  routes for edit a ticket
router.route('/edit')
  // .get(ticketsController.getTicket)   
  .get(loginController.isManagerLoggedIn, ticketsController.getTicket)   //  GET requests to get a ticket (no specific ID)
  // .post(ticketsController.createTicket); 
  .post(loginController.isManagerLoggedIn, ticketsController.createTicket)  //  POST requests to create a new ticket


// routes for edit a ticket by ID
router.route('/edit/:id')
  // .get(ticketsController.getTicket)     
  .get(loginController.isManagerLoggedIn, ticketsController.getTicket)  //  GET requests to get a specific ticket by ID

  // .put(ticketsController.updateTicket)   
  .put(loginController.isManagerLoggedIn, ticketsController.updateTicket)//  PUT requests to update a specific ticket by ID

  // .delete(ticketsController.deleteTicket); 
  .delete(loginController.isManagerLoggedIn, ticketsController.deleteTicket)//  DELETE requests to delete a specific ticket by ID

//route for getting tickets by date
router.route('/date')
  .get(ticketsController.getTicketsByDate);

// Export
module.exports = router;
