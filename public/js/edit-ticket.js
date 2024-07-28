// משתנים גלובליים לשמירת שינויים בקלטים
let gTitle = '';
let gOpponent = '';
let gStadium = '';
let gPrice = 0;
let gDate = '';
let gopImg = '';

let originalTitle = '';
let originalOpponent = '';
let originalStadium = '';
let originalPrice = 0;
let originalDate = '';
let originalOpImg = '';

// Initialize original values on page load
window.onload = function() {
    const ticket = JSON.parse(document.getElementById('ticket-data').textContent);
    if (ticket) {
        originalTitle = ticket.title || '';
        originalOpponent = ticket.opponent || '';
        originalStadium = ticket.stadium || '';
        originalPrice = ticket.price || 0;
        originalDate = ticket.date ? new Date(ticket.date).toISOString().slice(0, 16) : '';
        originalOpImg = ticket.opImg || '';
        // Initialize the global variables with the original values
        gTitle = originalTitle;
        gOpponent = originalOpponent;
        gStadium = originalStadium;
        gPrice = originalPrice;
        gDate = originalDate;
        gopImg = originalOpImg;
    }
};

async function onUpdateTicket(ev) {
    ev.preventDefault();

    const updatedFields = {};
    if (gTitle !== originalTitle) updatedFields.title = gTitle;
    if (gOpponent !== originalOpponent) updatedFields.opponent = gOpponent;
    if (gStadium !== originalStadium) updatedFields.stadium = gStadium;
    if (gPrice !== originalPrice) updatedFields.price = gPrice;
    if (gDate !== originalDate) updatedFields.date = gDate;
    if (gopImg !== originalOpImg) updatedFields.opImg = gopImg;

    try {
        const ticketId = $('#updateButton').val();
        const response = await $.ajax({
            url: '/tickets/edit/' + ticketId,
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updatedFields),
        });

        if (response) {
            showNotice('Ticket updated successfully.', false);
            setTimeout(function() {
                window.location.href = '/tickets';
            }, 2000);
        }
    } catch (e) {
        console.log('Error:', e);
        showNotice('Failed to update the ticket.', false);
    }
}

// מאזינים לשינויים בקלטים
function onChangeTitle(newTitle) {
    gTitle = newTitle;
}

function onChangeOpponent(newOpponent) {
    gOpponent = newOpponent;
}

function onChangeStadium(newStadium) {
    gStadium = newStadium;
}

function onChangePrice(newPrice) {
    const price = parseFloat(newPrice);
    if (price < 0) {
        showNotice('Price cannot be negative.', false);
        document.getElementById('price').value = 0;
        gPrice = 0;
    } else {
        gPrice = price;
    }
}

function onChangeDateTime(dateTime) {
    gDate = dateTime;
}

// הוספת כתובת מקור של תמונה ל-gopImg
function addTogSrcImgs(opImg) {
    gopImg = opImg.includes('data:') ? opImg : opImg.substring(opImg.lastIndexOf('/') + 1);
}

// הוספת תמונה
function onAddImg(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = function (e) {
            const imgElement = document.querySelector('.edit-ticket .edit-imgs img#image-preview');
            if (imgElement) {
                imgElement.src = e.target.result;
            } else {
                const ulElement = document.querySelector('.edit-ticket .edit-imgs ul');
                ulElement.innerHTML = `
                    <li id="0">
                        <img src="${e.target.result}" class="srcImg-0" id="image-preview" width="300">
                        <input type="file" accept="image/*" name="opImg" onchange="onAddImg(event.target)" id="0">
                        <button type="button" class="deleteImg" onclick="onDeleteImg('0')">Delete</button>
                    </li>`;
            }
            gopImg = e.target.result;
        };
    }
}

// שינוי תמונה
async function onChangeImg(event) {
    try {
        const imgSrc = await readChangedURL(event.target);
        addTogSrcImgs(imgSrc);
    } catch (e) {
        console.log('Error:', e);
    }
}

// מחיקת תמונה
function onDeleteImg(id) {
    const imgElement = document.querySelector(`.edit-ticket li#${id} img`);
    const fileInputElement = document.querySelector(`.edit-ticket li#${id} input[type="file"]`);

    if (imgElement) {
        imgElement.src = '/styles/imgs/products/placeholder.png';
    }

    if (fileInputElement) {
        fileInputElement.value = '';
    }
    gopImg = "";
}

// קריאת URL של התמונה שהשתנתה
async function readChangedURL(input) {
    if (input.files && input.files[0]) {
        return new Promise((res, rej) => {
            let reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = function (e) {
                const imgUrl = e.target.result;
                document.querySelector(`.edit-ticket .srcImg-${input.id}`).src = imgUrl;
                input.src = imgUrl;
                res(imgUrl);
            }
        });
    }
}

// הוספת כרטיס חדש
async function onAddTicket(ev) {
    ev.preventDefault();

    try {
        const newTicket = await $.ajax({
            url: '/tickets/edit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                title: gTitle,
                opponent: gOpponent,
                stadium: gStadium,
                price: gPrice,
                date: gDate,
                opImg: gopImg,
            }),
        });

        showNotice('New ticket added successfully.', false);
        setTimeout(function() {
            window.location.href = '/tickets';
        }, 2000);
    } catch (e) {
        console.log('Error:', e);
        showNotice('Failed to add new ticket.', false);
    }
}

// מחיקת כרטיס
async function onDeleteTicket(id) {
    try {
        const res = await $.ajax({
            url: '/tickets/edit/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
        });

        if (res.status !== 404) {
            showNotice('Ticket deleted successfully.', false);
            setTimeout(function() {
                window.location.href = '/tickets';
            }, 2000);
        } else {
            showNotice('Ticket could not be deleted.', false);
        }
    } catch (e) {
        console.log('Error:', e);
        showNotice('An error occurred while deleting the ticket.', false);
    }
}

// Function to show notice and redirect
function showNotice(message, redirectToCart) {
    document.getElementById('noticeModalBody').innerText = message;
    var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
    noticeModal.show();

    // Adding a delay before redirect
    setTimeout(function() {
        if (redirectToCart) {
            window.location.href = '/cart'; // Redirect to the cart page after 1 second
        } else {
            noticeModal.hide();
        }
    }, 2000);
}
