const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/tickets");
const loginController = require("../controllers/login");

router.get('/', ticketsController.getTickets);
router.get('/filter', ticketsController.getTicketssByFilter);
router.route('/edit')
  .get(ticketsController.getTicket)
  .post(ticketsController.createTicket);
// .get(loginController.isManagerLoggedIn, ticketsController.getTicket)
// .post(loginController.isManagerLoggedIn, ticketsController.createTicket);

router.route('/edit/:id')
  .get(ticketsController.getTicket)
  .put(ticketsController.updateTicket)
  .delete(ticketsController.deleteTicket);
// .get(loginController.isManagerLoggedIn, ticketsController.getTicket)
// .put(loginController.isManagerLoggedIn, ticketsController.updateTicket)
// .delete(loginController.isManagerLoggedIn, ticketsController.deleteTicket);

router.get('/date', ticketsController.getTicketsByDate);

module.exports = router;
