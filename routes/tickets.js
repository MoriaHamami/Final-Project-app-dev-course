const express = require("express");
const router = express.Router();
const ticketsController = require("../controllers/tickets");

// router.route('/')
//     .get(ticketsController.getTickets)
//     .post(ticketsController.createTicket); // שינוי כאן

// router.route('/:id') // שינוי כאן
//     .get(ticketsController.getTicket)
//     .put(ticketsController.updateTicket)
//     .delete(ticketsController.deleteTicket);

    router.route('/')
    .get(ticketsController.getTickets)

    router.route('/edit')
    .get(ticketsController.getTicket)
    .post(ticketsController.createTicket);

router.route('/edit/:id')
    .get(ticketsController.getTicket)
    .put(ticketsController.updateTicket)
    .delete(ticketsController.deleteTicket)


module.exports = router;



