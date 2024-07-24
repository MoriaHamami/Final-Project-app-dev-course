const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/tickets");

router.get('/', ticketsController.getTickets);
router.get('/filter', ticketsController.getTicketsByFilter);
router.route('/edit')
  .get(ticketsController.getTicket)
  .post(ticketsController.createTicket);

router.route('/edit/:id')
  .get(ticketsController.getTicket)
  .put(ticketsController.updateTicket)
  .delete(ticketsController.deleteTicket);

router.get('/date', ticketsController.getTicketsByDate);

module.exports = router;
