const Ticket = require('../models/tickets');

const createTicket = async (title = "", price = 0, stadium = "",opImg = "", opponent = "", date = "") => {
    const Ticket = new Ticket({
        title,
        price,
        stadium,
        opImg,
        opponent,
        date
    })
    try {
        return await Ticket.save()
    } catch (e) {
        return e
    }
}

const getTicketById = async (id) => {
    return await Ticket.findById(id)
}

// const getTicketsbymonth = async (month) => {
//     // בדיקה אם החודש מוגדר
//     if (!month) {
//         // אם לא מוגדר, השתמש בחודש נובמבר
//         month = 'Nov';
//     }

//     // יצירת תאריך התחלה וסיום לחודש המבוקש
//     const startDate = new Date(`2024-${month}-01`);
//     const endDate = new Date(`2024-${month}-31`);

//     // מציאת כרטיסים שהתאריך בינהם נמצא בחודש המבוקש
//     const Tickets = await Ticket.find({
//         date: {
//             $gte: startDate,
//             $lte: endDate
//         }
//     });

//     // אם אין תוצאות לחודש המבוקש, החזר את הכרטיסים של נובמבר
//     if (Tickets.length === 0) {
//         const NovTickets = await Ticket.find({
//             date: {
//                 $gte: new Date(`2024-Nov-01`),
//                 $lte: new Date(`2024-Nov-31`)
//             }
//         });
//         return NovTickets;
//     }

//     return Tickets;
// }

// const getTicketsbymonth = async () => {

//        const Tickets = await Ticket.find({})

//     return Tickets
// }



const getTickets = async () => {
    // try{

    // }catch(e){

    // }
    const getTickets = await Ticket.find({})
    return getTickets
}

// const getTicketsbymonth = async () => {
//     const aprilTickets = [];

//     for (let year = 2023; year <= 2026; year++) {
//         // יצירת תאריך התחלה לחודש אפריל בשנת הנוכחית בלולאה
//         const startDate = new Date(year, 0, 1); // כל חודש זה מינוס אחד
//         // יצירת תאריך סיום לחודש אפריל בשנת הנוכחית בלולאה (היום האחרון של החודש)
//         const endDate = new Date(year, 0, 30); // 30 באפריל

//         console.log(`Start Date for April ${year}: ${startDate}`);
//         console.log(`End Date for April ${year}: ${endDate}`);

//         // מציאת כל הכרטיסים שמתאימים לחודש אפריל בשנת הנוכחית בלולאה
//         const tickets = await Ticket.find({
//             date: {
//                 $gte: startDate,
//                 $lte: endDate
//             }
//         });

//         console.log(`Tickets found for April ${year}: ${tickets.length}`);

//         // הוספת הכרטיסים שנמצאו למערך הכולל
//         aprilTickets.push(...tickets);
//     }

//     return aprilTickets;
// }











const updateTicket = async (title = "", price = 0, stadium = "",opImg = "", opponent = "", date = "") => {
    const Ticket = await getTicketById(id)
    
    if (!Ticket)
        return null

    if (title) Ticket.title = title
    if (price) Ticket.price = price
    if (stadium) Ticket.stadium = stadium
    if (opImg) Ticket.opImg = opImg
    if (opponent) Ticket.opponent = opponent
    if (date) Ticket.date = date

    try {
        await Ticket.save()
        return Ticket
    } catch (e) {
        return e
    }
}

const deleteTicket = async (id) => {
    try {
        const Ticket = await getTicketById(id)
        if (!Ticket)
            return null

        await Ticket.remove()
        return Ticket
    } catch (e) {
        return e
    }
}


//אולי 
const filterTicketsByMonth = async (month) => {
    try {
        // הבאת כל הכרטיסים מהמסד נתונים
        const tickets = await Ticket.find({});

        // סינון הכרטיסים לפי חודש מסוים
        const filteredTickets = tickets.filter(ticket => {
            // קבלת החודש מתאריך הכרטיס
            const ticketMonth = ticket.date.getMonth();
            // השוואה בין החודשים
            return ticketMonth === month;
        });

        // החזרת הכרטיסים שעברו את סינון החודש
        return filteredTickets;
    } catch (error) {
        console.error("Error filtering tickets by month:", error);
        throw error;
    }
}


module.exports = {
    createTicket, 
    getTicketById,
    getTickets,
    updateTicket,
    deleteTicket,
    filterTicketsByMonth
}

