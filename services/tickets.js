const Ticket = require('../models/tickets');

const createTicket = async (title, price, stadium, opImg, opponent, date) => {
  const newTicket = new Ticket({
    title, price, stadium, opImg, opponent, date
  });
  return await newTicket.save();
};

const getTickets = async (filter = {}) => {
  try {
    const tickets = await Ticket.find(filter);
    return tickets;
  } catch (e) {
    console.log('e:', e);
  }
};

const getTicketsByMonth = async (month) => {
  let monthTickets = [];
  if (!month) {
    return await Ticket.find({});
  }
  for (let year = 2023; year <= 2026; year++) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const tickets = await Ticket.find({
      date: { $gte: startDate, $lte: endDate }
    });
    monthTickets.push(...tickets);
  }
  return monthTickets;
};

const updateTicket = async (id, title, price, stadium, opImg, opponent, date) => {
  const ticket = await Ticket.findById(id);
  if (!ticket) return null;

  ticket.title = title ?? ticket.title;
  ticket.price = price ?? ticket.price;
  ticket.stadium = stadium ?? ticket.stadium;
  ticket.opImg = opImg ?? ticket.opImg;
  ticket.opponent = opponent ?? ticket.opponent;
  ticket.date = date ?? ticket.date;

  return await ticket.save();
};

const deleteTicket = async (id) => {
  return await Ticket.findByIdAndDelete(id);
};

const getTicketById = async (id) => {
  return await Ticket.findById(id);
};

module.exports = {
  createTicket,
  getTickets,
  getTicketsByMonth,
  updateTicket,
  deleteTicket,
  getTicketById
};
