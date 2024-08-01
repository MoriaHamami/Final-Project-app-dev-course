// Global variables
let gTitle = '';
let gMonth = 0;
let gStadium = '';
let gIsManager = false
updateIsManager()

// Checks if the user is a manager
function updateIsManager() {
    $.ajax({
        url: '/login/isLogged', // API endpoint to check login status
        method: 'GET',
        contentType: 'application/json',
        success: function(user) {
            gIsManager = user?.isManager
        },
        error: function(error) {
            // Log any errors to the console
            console.error('Error:', error);
        }
    });
}

// filter by month 
function setMonth(newMonth = 0) {
    gMonth = newMonth;
    filterTickets(); 
}

// filter by title
function setTitle(newTitle = '') {
    gTitle = newTitle;
    filterTickets(); 
}

// filter by stadium
function setStadiumFilter(newStadium = '') {
    gStadium = newStadium;
    filterTickets(); 
}

// Function to filter tickets
async function filterTickets() {
    try {
        let url = `/tickets/filter?title=${gTitle}`;

        if (gMonth !== 0) {
            url += `&month=${gMonth}`; // Add month
        }

        if (gStadium) {
            url += `&stadium=${gStadium}`; // Add stadium
        }

        // Send an AJAX request to the server to get the filtered tickets
        const tickets = await $.ajax({
            url: url,
            method: 'GET',
            contentType: 'application/json',
        });

        renderTickets(tickets); // Display the filtered tickets
    } catch (error) {
        console.error('Error fetching tickets:', error); // Handle errors
    }
}

// Function to display the tickets on the page
function renderTickets(tickets) {
    let str = '';
    if (tickets.length === 0) {
        str = '<p>No tickets available</p>'; // Message if no tickets are available
    } else {
        // Create HTML for each ticket and display it on the page
        for (let i = 0; i < tickets.length; i++) {
            const ticketDate = new Date(tickets[i].date);
            const formattedDate = ticketDate.toLocaleDateString('en-GB').replace(/\//g, '.');
            const formattedTime = ticketDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            str += `<div class="card" style="width: 18rem;" data-stadium="${tickets[i].stadium}">
                <div class="battle">
                    <div class="team">
                        <img src="../styles/imgs/tickets/real.webp" id="real" alt="real">
                        <span>Real Madrid<br></span>
                    </div>
                    <div>
                        <img src="https://assets.realmadrid.com/is/content/realmadrid/4oogyu6o156iphvdvphwpck10-logo?$Mobile$&wid=144&hei=144"
                            class="card-img-top" alt="championleague">
                    </div>
                    <div class="team">
                        <img src="${tickets[i].opImg?.includes('data:') ? tickets[i].opImg : '/styles/imgs/tickets/' + tickets[i].opImg}"
                            id="byren" alt="byren">
                        <span>${tickets[i].opponent}<br></span>
                    </div>
                </div>
                <div class="card-body">
                 ${gIsManager ?
                    `<div class="edit-icon" onclick="getEditTicketPage('${tickets[i]._id}')">
                        <i class="bi bi-pencil"></i>
                    </div>` : ""
                }
                    <h4 class="card-title">${tickets[i].title}</h4>
                    <div>
                        <i class="bi bi-calendar3"></i>
                        <span>${formattedDate}</span>
                    </div>
                    <div>
                        <i class="bi bi-clock"></i>
                        <span>${formattedTime}</span>
                    </div>
                    <div class="icon-text-container">
                        <div>
                            <i class="bi bi-geo-alt"></i>
                            <span>${tickets[i].stadium}</span>
                        </div>
                    </div>
                    <div class="icon-text-container">
                        <div>
                            <i class="bi bi-ticket-detailed"></i>
                            <span id="priceof_tic">${tickets[i].price}$</span>
                        </div>
                    </div>
                    <ul class="list-group list-group-flush">
                        <a href="#" class="btn btn-primary custom-button"
                            onclick="addToCart('${tickets[i]._id}')">
                            <i class="bi bi-gem"></i> Buy ticket NOW
                        </a>
                    </ul>
                </div>
            </div>`;
        }
    }
    $('#tickets').html(str); 
}

//  edit page by ticket ID
function getEditTicketPage(ticketId) {
    window.location.href = `/tickets/edit/${ticketId}`;
}

// Function to add a ticket to the cart
async function addToCart(ticketId) {
    try {
        const response = await $.ajax({
            url: '/cart/add',
            method: 'POST',
            contentType: 'application/json',
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
                'X-Requested-With': 'XMLHttpRequest'
            },
            data: JSON.stringify({
                productId: ticketId,
                quantity: 1  // Fixed quantity
            }),
            xhrFields: {
                withCredentials: true
            }
        });

        if (response.status === 401) {
            showNotice('You need to log in first', true); // Message if the user is not logged in
        } else if (response.success) {
            showNotice('Ticket added to cart successfully', false); // Success message
        } else {
            showNotice('Error adding ticket to cart', false); // Error message
        }
    } catch (e) {
        showNotice('Error adding ticket to cart', false); // Error message
    }
}

// show notices 
function showNotice(message, redirectToLogin) {
    $('#noticeModalBody').text(message); 
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {}); 
    noticeModal.show(); 

    setTimeout(function() {
        if (redirectToLogin) {
            window.location.href = '/login'; // Redirect to login page if needed
        } else {
            noticeModal.hide(); // Hide 
        }
    }, 3000);
}