let gMonth = 0;

window.setMonth = function(newMonth = '') {
    gMonth = newMonth;
    const amount = document.getElementById('amount').value;
    
    // Validate amount range before proceeding
    if (amount < 1 || amount > 10) {
        alert('Please enter a number between 1 and 10 for ticket quantity.');
        return; // Stop further execution if validation fails
    }
    
    getTicketsByMonth(gMonth);
};

async function getTicketsByMonth(month = '') {
    try {
        // Sending GET request with the selected month parameter
        const tickets = await $.ajax({
            url: `/tickets/date?date=${month}`,
            method: 'GET',
            contentType: 'application/json',
        });

        // Creating HTML to display the tickets
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
                        <img src="/styles/imgs/tickets/${tickets[i].opImg}" id="byren" alt="byren">
                        <span>${tickets[i].opponent}<br></span>
                    </div>
                </div>
                <div class="card-body">
                    <h4 class="card-title">${tickets[i].title}</h4>
                    <div class="icon-text-container">
                        <div>
                            <i class="bi bi-calendar3"></i>
                            <span>${new Date(tickets[i].date).toLocaleDateString()}</span>
                        </div>
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
                        add more tickets here
                        <input id="amount" type="number" value="1" name="add more tickets here">
                    </label>
                    <ul class="list-group list-group-flush">
                        <a href="#" class="btn btn-primary"><i class="bi bi-gem"></i>Buy ticket NOW</a>
                    </ul>
                </div>
            </div>`;
        }

        // Displaying the tickets in HTML
        $('#tickets').html(str);
    } catch (e) {
        console.log('e:', e);
        // Displaying an error message if needed
    }
}
