const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/tickets");

router.get('/', ticketsController.getTickets);
router.get('/filter', ticketsController.getTicketssByFilter);
router.get('/edit', ticketsController.getTicket);
router.post('/edit', ticketsController.createTicket);
router.get('/edit/:id', ticketsController.getTicket);
router.put('/edit/:id', ticketsController.updateTicket);
router.delete('/edit/:id', ticketsController.deleteTicket);
router.get('/date', ticketsController.getTicketsByDate);


module.exports = router;
