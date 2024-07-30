// Global variables to store the search criteria
let gTitle = '';
let gMonth = 0;
let gStadium = '';

// Function to set the selected month and filter the tickets
function setMonth(newMonth = 0) {
    gMonth = newMonth; // Update the selected month
    console.log(`Month set to: ${gMonth}`);
    filterTickets(); // Filter tickets based on the new month
}

// Function to set the selected title and filter the tickets
function setTitle( newTitle = '') {
    gTitle = newTitle; // Update the selected title
    console.log(`Title set to: ${gTitle}`);
    filterTickets(); // Filter tickets based on the new title
}

// Function to set the selected stadium and filter the tickets
function setStadiumFilter(newStadium = '') {
    gStadium = newStadium; // Update the selected stadium
    console.log(`Stadium set to: ${gStadium}`);
    filterTickets(); // Filter tickets based on the new stadium
}

// Function to filter tickets based on the selected criteria
async function filterTickets() {
    try {
        // Create the URL for the filter request
        let url = `/tickets/filter?title=${gTitle}`;
        
        if (gMonth !== 0) {
            // Add month to the URL if a month is selected
            url += `&month=${gMonth}`;
        }
        
        if (gStadium) {
            // Add stadium to the URL if a stadium is selected
            url += `&stadium=${gStadium}`;
        }

        // Send an AJAX request to the server to get the filtered tickets
        const tickets = await $.ajax({
            url: url,
            method: 'GET',
            contentType: 'application/json',
        });
        console.log('Filtered tickets:', tickets);
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
                 ${isManager ?
                    `<div class="edit-icon" onclick="getEditTicketPage('${tickets[i]._id}')">
                        <i class="bi bi-pencil"></i>
                    </div>` : ""
                }
                    <h4 class="card-title">${tickets[i].title}</h4>
                    <div>
                        <i class="bi bi-calendar3"></i>
                        <span>${new Date(tickets[i].date).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <i class="bi bi-clock"></i>
                        <span>${new Date(tickets[i].date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                            <span id="priceof_tic">${tickets[i].price}€</span>
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
    const ticketContainer = document.getElementById('tickets'); // Find the target element
    ticketContainer.innerHTML = str; // Add the tickets to the page
}

// Function to navigate to the ticket edit page based on the ticket ID
function getEditTicketPage(ticketId) {
    window.location.href = `/tickets/edit/${ticketId}`;
}

// Function to add a ticket to the cart
async function addToCart(ticketId) {
    try {
        const response = await fetch('/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Language': 'he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                productId: ticketId,
                quantity: 1  // Fixed quantity
            }),
            credentials: 'include'
        });

        if (response.status === 401) {
            showNotice('You need to log in first', true); // Message if the user is not logged in
        } else if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showNotice('Ticket added to cart successfully', false); // Success message
            } else {
                showNotice('Error adding ticket to cart', false); // Error message
            }
        } else {
            showNotice('Error adding ticket to cart', false); // Error message
        }
    } catch (e) {
        showNotice('Error adding ticket to cart', false); // Error message
    }
}

// Function to show notices to the user
function showNotice(message, redirectToLogin) {
    document.getElementById('noticeModalBody').innerText = message; // Display the message in the modal body
    var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {}); // Create a new modal
    noticeModal.show(); // Show the modal

    setTimeout(function() {
        if (redirectToLogin) {
            window.location.href = '/login'; // Redirect to login page if needed
        } else {
            noticeModal.hide(); // Hide the modal after some time
        }
    }, 3000); // Adjust the timeout as needed
}
