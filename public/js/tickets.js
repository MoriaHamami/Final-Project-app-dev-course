let gTitle = '';
let gMonth = 0;
let gStadium = '';

function setMonth(isManager, newMonth = 0) {
    gMonth = newMonth;
    console.log(`Month set to: ${gMonth}`);
    filterTickets(isManager);
}

function setTitle(isManager, newTitle = '') {
    gTitle = newTitle;
    console.log(`Title set to: ${gTitle}`);
    filterTickets(isManager);
}

function setStadiumFilter(newStadium = '') {
    gStadium = newStadium;
    console.log(`Stadium set to: ${gStadium}`);
    filterTickets();
}

async function filterTickets(isManager) {
    try {
        let url = `/tickets/filter?title=${gTitle}`;
        
        if (gMonth !== 0) {
            url += `&month=${gMonth}`;
        }
        
        if (gStadium) {
            url += `&stadium=${gStadium}`;
        }

        const tickets = await $.ajax({
            url: url,
            method: 'GET',
            contentType: 'application/json',
        });
        console.log('Filtered tickets:', tickets);
        renderTickets(isManager, tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
}

function renderTickets(isManager, tickets) {
    let str = '';
    if (tickets.length === 0) {
        str = '<p>No tickets available</p>';
    } else {
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
                        <a href="#" class="btn btn-primary" onclick="addToCart('${tickets[i]._id}')">
                            <i class="bi bi-gem"></i> Buy ticket NOW
                        </a>
                    </ul>
                </div>
            </div>`;
        }
    }
    const ticketContainer = document.getElementById('tickets');
    ticketContainer.innerHTML = str;
}

function getEditTicketPage(ticketId) {
    window.location.href = `/tickets/edit/${ticketId}`;
}


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
                quantity: 1  // כמות קבועה
            }),
            credentials: 'include'
        });

        if (response.status === 401) {
            showNotice('צריך להתחבר קודם', true);
        } else if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showNotice('הכרטיס נוסף לעגלה בהצלחה', false);
            } else {
                showNotice('שגיאה בהוספת הכרטיס לעגלה', false);
            }
        } else {
            showNotice('שגיאה בהוספת הכרטיס לעגלה', false);
        }
    } catch (e) {
        showNotice('שגיאה בהוספת הכרטיס לעגלה', false);
    }
}

function showNotice(message, redirectToLogin) {
    document.getElementById('noticeModalBody').innerText = message;
    var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
    noticeModal.show();

    setTimeout(function() {
        if (redirectToLogin) {
            window.location.href = '/login';
        } else {
            noticeModal.hide();
        }
    }, 3000); // Adjust the timeout as needed
}

function getEditTicketPage(ticketId) {
    window.location.href = `/tickets/edit/${ticketId}`;
}
