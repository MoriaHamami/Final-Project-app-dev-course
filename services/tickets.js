const Ticket = require('../models/tickets');

const createTicket = async (title, price, stadium, opImg, opponent, date) => { /* 8 */
  const newTicket = new Ticket({
    title,
    price,
    stadium,
    opImg,
    opponent,
    date
  });
  try {
    return await newTicket.save();
  } catch (e) {
    return e;
  }
};

const getTickets = async () => {
  return await Ticket.find({});
};

const getTicketsByMonth = async (month) => {
  if (!month) {
    // If no month is provided, return all tickets
    const allTickets = await Ticket.find({});
    return allTickets;
  }

  const monthTickets = [];
  for (let year = 2023; year <= 2026; year++) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const tickets = await Ticket.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    monthTickets.push(...tickets);
  }

  return monthTickets;
};


const updateTicket = async (id, title, price, stadium, opImg, opponent, date) => {
  const ticket = await getTicketById(id);

  if (!ticket)
    return null;

  if (title) ticket.title = title;
  if (price) ticket.price = price;
  if (stadium) ticket.stadium = stadium;
  if (opImg) ticket.opImg = opImg;
  if (opponent) ticket.opponent = opponent;
  if (date) ticket.date = date;

  try {
    await ticket.save();
    return ticket;
  } catch (e) {
    return e;
  }
};

const deleteTicket = async (id) => {
  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return null;
    }

    await ticket.deleteOne();
    console.log(ticket);
    return ticket;
  } catch (e) {
    return e;
  }
};


// const getTicketById = async (id) => {
//   return await Ticket.findById(id)
// };

// // const getProductById = async (id) => {
// //   return await Product.findById(id)
// // }

const getTicketById = async (id) => {
  try {
    return await Ticket.findById(id);
  } catch (error) {
    console.error('Error fetching ticket by id:', error);
    throw error; // אפשר לטפל בשגיאה אם רצינו
  }
};


module.exports = {
  createTicket,
  getTickets,
  getTicketsByMonth,
  updateTicket,
  deleteTicket,
  getTicketById
};
