// Global variables
let gTitle = '';
let gOpponent = '';
let gStadium = '';
let gPrice = 0;
let gDate = '';
let gOpImg = '';

let originalTitle = '';
let originalOpponent = '';
let originalStadium = '';
let originalPrice = 0;
let originalDate = '';
let originalOpImg = '';

//original values on page load
window.onload = function () {
    const ticket = JSON.parse($('#ticket-data').text());
    if (ticket) {
        originalTitle = ticket.title || '';
        originalOpponent = ticket.opponent || '';
        originalStadium = ticket.stadium || '';
        originalPrice = ticket.price || 0;
        originalDate = ticket.date ? new Date(ticket.date).toISOString().slice(0, 16) : '';
        originalOpImg = ticket.opImg || '';
    
        gTitle = originalTitle;
        gOpponent = originalOpponent;
        gStadium = originalStadium;
        gPrice = originalPrice;
        gDate = originalDate;
        gOpImg = originalOpImg;
    }
};

// Trigger file input click when the button is clicked
$('.file-btn').click(function () {
    $(".file-input").trigger('click');
});

//ticket update
async function onUpdateTicket(ev) {
    ev.preventDefault();

    const updatedFields = {};
    if (gTitle !== originalTitle) updatedFields.title = gTitle;
    if (gOpponent !== originalOpponent) updatedFields.opponent = gOpponent;
    if (gStadium !== originalStadium) updatedFields.stadium = gStadium;
    if (gPrice !== originalPrice) updatedFields.price = gPrice;
    if (gDate !== originalDate) updatedFields.date = gDate;
    if (gOpImg !== originalOpImg) updatedFields.opImg = gOpImg;

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
            setTimeout(function () {
                window.location.href = '/tickets';
            }, 2000);
        }
    } catch (e) {
        showNotice('Failed to update the ticket.', false);
    }
}

//input changes
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
        $('#price').val(0);
        gPrice = 0;
    } else {
        gPrice = price;
    }
}

function onChangeDateTime(dateTime) {
    gDate = dateTime;
}

// Update image 
function updategSrcImg(opImg) {
    if (!opImg) {
        const imgElement = $('.edit-ticket li img');
        imgElement.attr('src', '/styles/imgs/tickets/placeholder.png');
        const fileInputElement = $('.edit-ticket input[type="file"]');
        fileInputElement.val('');
        return;
    }
    gOpImg = opImg.includes('data:') ? opImg : opImg.substring(opImg.lastIndexOf('/') + 1);
    const imgElement = $('.edit-ticket li img');
    imgElement.attr('src', gOpImg);
}

//image change
async function onChangeImg(event) {
    try {
        const imgSrc = await readChangedURL(event.target);
        updategSrcImg(imgSrc);
    } catch (e) {
        console.log('Error:', e);
    }
}

// Delete image
function onDeleteImg() {
    const imgElement = $('#image-preview');
    const fileInputElement = $('input[type="file"][name="opImg"]');
    if (imgElement) {
        imgElement.attr('src', '/styles/imgs/tickets/placeholder.png');
    }

    if (fileInputElement) {
        fileInputElement.val('');
    }
    gOpImg = "";
}

// Read URL of the changed image
async function readChangedURL(input) {
    if (input.files && input.files[0]) {
        return new Promise((res, rej) => {
            let reader = new FileReader();
            reader.readAsDataURL(input.files[0]);
            reader.onload = function (e) {
                const imgUrl = e.target.result;
                $(`.edit-ticket .srcImg-${input.id}`).attr('src', imgUrl);
                input.src = imgUrl;
                res(imgUrl);
            };
        });
    }
}

// Add a new ticket
async function onAddTicket(ev) {
    ev.preventDefault();

    // Check if all fields are filled
    if (!gTitle || !gOpponent || !gStadium || !gPrice || !gDate || !gOpImg) {
        showNotice('All fields are required.', false);
        return;
    }

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
                opImg: gOpImg,
            }),
        });

        showNotice('New ticket added successfully.', false);
        setTimeout(function () {
            window.location.href = '/tickets';
        }, 2000);
    } catch (e) {
        showNotice('Failed to add new ticket.', false);
    }
}

// Delete a ticket
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
            setTimeout(function () {
                window.location.href = '/tickets';
            }, 2000);
        } else {
            showNotice('Ticket could not be deleted.', false);
        }
    } catch (e) {
        showNotice('An error occurred while deleting the ticket.', false);
    }
}

//show notice and redirect back to cart page
function showNotice(message, redirectToCart) {
    $('#noticeModalBody').text(message);
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {});
    noticeModal.show();

    //delay before redirect
    setTimeout(function () {
        if (redirectToCart) {
            window.location.href = '/cart'; // Redirect to the cart page after 1 second
        } else {
            noticeModal.hide();
        }
    }, 2000);
}
