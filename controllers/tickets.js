const ticketsService = require('../services/tickets');

const createTicket = async (req, res) => {
  const { title, price, stadium, opImg, opponent, date} = req.body;

  try {
    const newTicket = await ticketsService.createTicket(title, price, stadium, opImg, opponent, date);
    res.json(newTicket);
  } catch (e) {
    res.json(e);
    // return res.json("Product wasn't added successfully"+ e)
  }
}

const getTickets = async (req, res) => {
  try {
    const filteredTickets = await ticketsService.getTickets(); // לשים לב שקוראים לפונקצית המסנן
    res.render('tickets.ejs', { filteredTickets });
  } catch (e) {
    console.log('e:', e);
  }
}

const getTicket = async (req, res) => {
  if (!req.params.id) return res.render('edit-ticket.ejs', { Ticket: null });
  const Ticket = await ticketsService.getTicketById(req.params.id);
  if (!Ticket) {
    return res.status(404).json({ errors: ['Ticket not found'] });
  } else (req.path.includes('edit')) 
    res.render('edit-ticket.ejs', { Ticket });
}

const updateTicket = async (req, res) => {
  let id = req.params.id;
  const { title, price, stadium, opImg, opponent, date} = req.body;
  try {
    const Ticket = await ticketsService.updateTicket(id, title, price, stadium, opImg, opponent, date);
    res.json({ success: true, message: 'Ticket updated successfully' });
  } catch (e) {
    res.status(500).json({ success: false, message: "Ticket wasn't updated successfully", error: e });
  }
}


const deleteTicket = async (req, res) => {
  try {
    const Ticket = await ticketsService.deleteTicket(req.params.id);
    if (!Ticket) {
      return res.status(404).json({ errors: ['Ticket not found'] });
    }
  } catch (e) {
    res.json("Ticket wasn't deleted successfully" + e);
  }
}


module.exports ={
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket
}



