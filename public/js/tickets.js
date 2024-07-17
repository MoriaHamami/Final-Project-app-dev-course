let gTitle = '';
let gMonth = 0;

window.setMonth = function (isManager, newMonth = '') {
    gMonth = newMonth;
    const amount = document.getElementById('amount').value;

    if (amount < 1 || amount > 10) {
        alert('Please enter a number between 1 and 10 for ticket quantity.');
        return;
    }

    getTicketsByMonth(isManager, gMonth);
};

function getEditTicketPage(id) {
    window.location.assign('/tickets/edit/' + id)
}

function setTitle(isManager, newTitle) {
    gTitle = newTitle;
    getTicketsByTitle(isManager);
}

async function getTicketsByTitle(isManager) {
    try {
        const tickets = await $.ajax({
            url: `/tickets/filter?filters[title]=${gTitle}`,
            method: 'GET',
            contentType: 'application/json',
        });
        renderTickets(isManager, tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
}

async function getTicketsByMonth(isManager, month = '') {
    try {
        const tickets = await $.ajax({
            url: `/tickets/date?date=${month}`,
            method: 'GET',
            contentType: 'application/json',
        });
        renderTickets(isManager, tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
}

function renderTickets(isManager, tickets) {
    let str = '';
    for (let i = 0; i < tickets.length; i++) {
        str += `<div class="card" style="width: 18rem;">
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
                <label>
                    Add more tickets here
                    <input id="amount" type="number" value="1" name="add more tickets here" min="1" max="10">
                </label>
                <ul class="list-group list-group-flush">
                    <a href="#" class="btn btn-primary"><i class="bi bi-gem"></i>Buy ticket NOW</a>
                </ul>
            </div>
        </div>`;
    }
    const ticketContainer = document.getElementById('tickets');
    ticketContainer.innerHTML = str;
}
