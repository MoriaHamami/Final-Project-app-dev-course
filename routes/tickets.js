// Import necessary modules
const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/tickets");

// Handle routes for '/tickets'
router.route('/')
    .get(ticketsController.getTickets)

// Handle routes for '/tickets/edit'
router.route('/edit') /* 5 */
    .get(ticketsController.getTicket)
    .post(ticketsController.createTicket)

// Handle routes for '/tickets/edit/:id'
router.route('/edit/:id')
    .get(ticketsController.getTicket)
    .put(ticketsController.updateTicket)
    .delete(ticketsController.deleteTicket)

// Handle routes for '/tickets/date'
router.route('/date')
    .get(ticketsController.getTicketsByDate)

module.exports = router;
