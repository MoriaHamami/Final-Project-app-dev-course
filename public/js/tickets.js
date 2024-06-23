// // async function getTicketsByMonth(month) {
// //     const monthTickets = [];
// //     console.log(`hi`);

// //     for (let year = 2023; year <= 2026; year++) {
// //         const startDate = new Date(year, month - 1, 1);
// //         const endDate = new Date(year, month - 1, 30); // or any other appropriate end date for the month

// //         console.log(`Start Date for Month ${month} in ${year}: ${startDate}`);
// //         console.log(`End Date for Month ${month} in ${year}: ${endDate}`);

// //         const tickets = await Ticket.find({
// //             date: {
// //                 $gte: startDate,
// //                 $lte: endDate
// //             }
// //         });

// //         console.log(`Tickets found for Month ${month} in ${year}: ${tickets.length}`);

// //         monthTickets.push(...tickets);
// //     }

// //     return monthTickets;
// // }


// async function getTicketsByMonth2(month) {
//     const monthTickets = [];
//     console.log(`hi`);

//     for (let year = 2023; year <= 2026; year++) {
//         const startDate = new Date(year, month - 1, 1);
//         const endDate = new Date(year, month - 1, 30); // or any other appropriate end date for the month

//         console.log(`Start Date for Month ${month} in ${year}: ${startDate}`);
//         console.log(`End Date for Month ${month} in ${year}: ${endDate}`);

//         $.ajax({
//             url: '/tickets?filter= ${month} ', // או כל נתיב אחר לקובץ השרת שלך
//             method: 'GET',
//             data: {
//                 month: month,
//                 year: year
//             },
//             success: function(response) {
//                 console.log(`Tickets found for Month ${month} in ${year}: ${response.length}`);
//                 monthTickets.push(...response);
//             },
//             error: function(error) {
//                 console.error('Error fetching tickets:', error);
//             }
//         });
//     }

//     return monthTickets;
// }


// const Ticket = require('../models/tickets');
                
// async function getTicketsByMonth3(month) {
//     const monthTickets = [];

//     const aprilTickets = [];

//     for (let year = 2023; year <= 2026; year++) {
//         // יצירת תאריך התחלה לחודש אפריל בשנת הנוכחית בלולאה
//         const startDate = new Date(year, month-1, 1); // כל חודש זה מינוס אחד
//         // יצירת תאריך סיום לחודש אפריל בשנת הנוכחית בלולאה (היום האחרון של החודש)
//         const endDate = new Date(year, month-1, 30); // 30 באפריל

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
// </script>