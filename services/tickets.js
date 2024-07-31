const Ticket = require('../models/tickets');

//create a new ticket
const createTicket = async (title, price, stadium, opImg, opponent, date) => {
  const newTicket = new Ticket({
    title, price, stadium, opImg, opponent, date
  });
  return await newTicket.save();
};

//get tickets with a given filter 
const getTickets = async (filter = {}) => {
  try {
    const tickets = await Ticket.find(filter); // Find tickets in the database
    return tickets;
  } catch (e) {
    console.error('Error in getTickets:', e); // errors
    throw e;
  }
};

// get tickets by a specific month across the years 2023 to 2026
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

//get tickets by month
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
};

//get tickets by stadium
const testTicketsByStadium = async (stadium) => {
  const tickets = await Ticket.find({ stadium: stadium });
};

//update a ticket by ID
const updateTicket = async (id, title, price, stadium, opImg, opponent, date) => {
  const ticket = await Ticket.findById(id); // Find the ticket by ID
  if (!ticket) return null; // If the ticket is not found, return null

  // Update the ticket fields if new values are provided, otherwise keep the existing values
  ticket.title = title ?? ticket.title;
  ticket.price = price ?? ticket.price;
  ticket.stadium = stadium ?? ticket.stadium;
  ticket.opImg = opImg ?? ticket.opImg;
  ticket.opponent = opponent ?? ticket.opponent;
  ticket.date = date ?? ticket.date;

  return await ticket.save(); // Save the updated ticket
};

//delete a ticket by  ID
const deleteTicket = async (id) => {
  return await Ticket.findByIdAndDelete(id); 
};

//get a ticket by ID
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
