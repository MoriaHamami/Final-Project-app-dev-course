const ticketsService = require('../services/tickets');

const getTickets = async (req, res) => {
  try {
    const ALLTickets = await ticketsService.getTickets();
    res.render('tickets.ejs', { ALLTickets });
  } catch (e) {
    console.log('Error fetching tickets:', e);
    res.status(500).json({ error: 'Error fetching tickets' });
  }
};

const getTicketsByDate = async (req, res) => {
  try {
    const monthFilter = req.query.date;
    const TicketsINFO = await ticketsService.getTicketsByMonth(monthFilter);
    res.json(TicketsINFO);
  } catch (e) {
    console.log('Error fetching tickets by date:', e);
    res.status(500).json({ error: 'Error fetching tickets by date' });
  }
};

const createTicket = async (req, res) => {
  const { title, price, stadium, opImg, opponent, date } = req.body;
  try {
    const newTicket = await ticketsService.createTicket(title, price, stadium, opImg, opponent, date);
    res.json(newTicket);
  } catch (e) {
    console.log('Error creating ticket:', e);
    res.status(500).json({ error: 'Error creating ticket' });
  }
};

const getTicket = async (req, res) => { /* 6 */
  try {
    if (!req.params.id) {
      // If no ID parameter is provided, render the edit page without ticket details
      return res.render('edit-ticket.ejs', { Ticket: null });
    }

    // Fetch the ticket details from the database using the provided ID
    const Ticket = await ticketsService.getTicketById(req.params.id);

    if (!Ticket) {
      // If no ticket found with the given ID, return a 404 error
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Check if the path includes 'edit', render the edit ticket page without ticket details
    if (req.path.includes('edit')) {
      return res.render('edit-ticket.ejs', { Ticket });
    } else {
      // If the path does not include 'edit', redirect to the page listing all tickets
      return res.redirect('/tickets');
    }
  } catch (e) {
    // Handle any errors that occur during fetching the ticket
    console.log('Error fetching ticket:', e);
    return res.status(500).json({ error: 'Error fetching ticket' });
  }
};



const updateTicket = async (req, res) => {
  const id = req.params.id;

  const { title, price, stadium, opImg, opponent, date } = req.body;
  try {

    await ticketsService.updateTicket(id, title, price, stadium, opImg, opponent, date);

  } catch (e) {
    res.json("ticket wasn't saved successfully" + e)
};
}


const deleteTicket = async (req, res) => {
  try {
    const Ticket = await ticketsService.deleteTicket(req.params.id);
    if (!Ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (e) {
    console.log('Error deleting ticket:', e);
    res.status(500).json({ error: "Ticket wasn't deleted successfully", details: e });
  }
};

module.exports = {
  getTickets,
  getTicketsByDate,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket
}
