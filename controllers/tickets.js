const ticketsService = require('../services/tickets');
const loginController = require('./login');

const getTickets = async (req, res) => {
  try {
    const ALLTickets = await ticketsService.getTickets();
    const isManager = await loginController.getIsManager(req, res);
    res.render('tickets.ejs', { ALLTickets, isManager });
  } catch (e) {
    res.status(500).json({ error: 'Error fetching tickets' });
  }
};

const getTicketssByFilter = async (req, res) => {
  try {
    const titleFilter = req.query.title;
    const monthFilter = req.query.month;
    const stadiumFilter = req.query.stadium;

    const filter = {};

    if (titleFilter) {
      filter.title = new RegExp(titleFilter, 'i');
    }

    if (monthFilter) {
      const startDate = new Date(2023, monthFilter - 1, 1);
      const endDate = new Date(2023, monthFilter, 0);
      filter.date = { $gte: startDate, $lte: endDate };
    }

    if (stadiumFilter) {
      filter.stadium = stadiumFilter;
    }

    const tickets = await ticketsService.getTickets(filter);
    res.json(tickets);
  } catch (e) {
    res.status(500).send('Internal Server Error');
  }
};



const getTicketsByDate = async (req, res) => {
  try {
    const monthFilter = req.query.date;
    const TicketsINFO = await ticketsService.getTicketsByMonth(monthFilter);
    res.json(TicketsINFO);
  } catch (e) {
    res.status(500).json({ error: 'Error fetching tickets by date' });
  }
};

const createTicket = async (req, res) => {
  const { title, price, stadium, opImg, opponent, date } = req.body;
  try {
    const newTicket = await ticketsService.createTicket(title, price, stadium, opImg, opponent, date);
    res.json(newTicket);
  } catch (e) {
    res.status(500).json({ error: 'Error creating ticket' });
  }
};

const getTicket = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.render('edit-ticket.ejs', { Ticket: null });
    }
    const Ticket = await ticketsService.getTicketById(req.params.id);
    if (!Ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    if (req.path.includes('edit')) {
      return res.render('edit-ticket.ejs', { Ticket });
    } else {
      return res.redirect('/tickets');
    }
  } catch (e) {
    res.status(500).json({ error: 'Error fetching ticket' });
  }
};

const updateTicket = async (req, res) => {
  const id = req.params.id;
  const { title, price, stadium, opImg, opponent, date } = req.body;
  try {
    await ticketsService.updateTicket(id, title, price, stadium, opImg, opponent, date);
    res.redirect('/tickets');
  } catch (e) {
    res.status(500).json({ error: "Ticket wasn't saved successfully", details: e });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const Ticket = await ticketsService.deleteTicket(req.params.id);
    if (!Ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: "Ticket wasn't deleted successfully", details: e });
  }
};

module.exports = {
  getTickets,
  getTicketsByDate,
  getTicketssByFilter,
  createTicket,
  getTicket,
  updateTicket,
  deleteTicket
};
