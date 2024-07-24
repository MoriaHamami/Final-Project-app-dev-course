const Ticket = require('../models/tickets');

const createTicket = async (title, price, stadium, opImg, opponent, date) => {
  const newTicket = new Ticket({
    title, price, stadium, opImg, opponent, date
  });
  return await newTicket.save();
};

const getTickets = async (filter = {}) => {
  try {
      console.log('Filter in getTickets:', filter); // log the filter
      const tickets = await Ticket.find(filter);
      console.log('Tickets found:', tickets); // log the found tickets
      return tickets;
  } catch (e) {
      console.error('Error in getTickets:', e);
      throw e;
  }
};

const getTicketsByMonth = async (month) => {
  let monthTickets = [];
  for (let year = 2023; year <= 2026; year++) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    const tickets = await Ticket.find({
      date: { $gte: startDate, $lt: endDate }
    });
    monthTickets.push(...tickets);
  }
  return monthTickets;
};

const testTicketsByMonthRange = async (month) => {
  let ticketsInRange = [];
  for (let year = 2023; year <= 2026; year++) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    const tickets = await Ticket.find({
      date: { $gte: startDate, $lt: endDate }
    });
    ticketsInRange.push(...tickets);
  }
  console.log(`Tickets for month ${month} from 2023 to 2026:`, ticketsInRange);
};

const testTicketsByStadium = async (stadium) => {
  const tickets = await Ticket.find({ stadium: stadium });
  console.log(`Tickets for stadium ${stadium}:`, tickets);
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
  testTicketsByMonthRange,
  testTicketsByStadium,
  updateTicket,
  deleteTicket,
  getTicketById
};
