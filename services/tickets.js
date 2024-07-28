const Ticket = require('../models/tickets');

// Function to create a new ticket
const createTicket = async (title, price, stadium, opImg, opponent, date) => {
  const newTicket = new Ticket({
    title, price, stadium, opImg, opponent, date
  });
  return await newTicket.save();
};

// Function to get tickets with a given filter (default: empty filter)
const getTickets = async (filter = {}) => {
  try {
    const tickets = await Ticket.find(filter); // Find tickets in the database according to the filter
    return tickets;
  } catch (e) {
    console.error('Error in getTickets:', e); // Handle errors and log them to the console
    throw e;
  }
};

// Function to get tickets by a specific month across the years 2023 to 2026
const getTicketsByMonth = async (month) => {
  let monthTickets = [];
  for (let year = 2023; year <= 2026; year++) {
    const startDate = new Date(year, month - 1, 1); // Start of the month
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // End of the month
    const tickets = await Ticket.find({
      date: { $gte: startDate, $lt: endDate } // Date filter
    });
    monthTickets.push(...tickets); // Add found tickets to the array
  }
  return monthTickets;
};

// Test function to get tickets by a specific month and log them to the console (not part of business logic)
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

// Test function to get tickets by stadium and log them to the console (not part of business logic)
const testTicketsByStadium = async (stadium) => {
  const tickets = await Ticket.find({ stadium: stadium });
  console.log(`Tickets for stadium ${stadium}:`, tickets);
};

// Function to update a ticket by a given ID
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

// Function to delete a ticket by a given ID
const deleteTicket = async (id) => {
  return await Ticket.findByIdAndDelete(id); // Delete the ticket by ID
};

// Function to get a ticket by a given ID
const getTicketById = async (id) => {
  return await Ticket.findById(id); // Find the ticket by ID
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
