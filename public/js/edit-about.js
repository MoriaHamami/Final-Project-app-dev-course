// Global variable to keep track of input changes
let gShops = [];
// Initialize the amount of shops according to the DOM
let gNumOfShops = $('.edit-about .edit-shops li').length || 0;
let nextAvailableId = gNumOfShops + 1;
const fieldsPerShop = 4;

function onAddShop() {
    if (gNumOfShops != 0) {
        const elFirstShop = $('.edit-about .edit-shops li:first-child');
        elFirstShop.before(
            `<li id=${nextAvailableId}>
                <input value="" placeholder="Type location name" name="shops">
                <input value="" placeholder="Type location address" name="shops">
                <input value="" placeholder="Type location latitude" name="shops" type="number">
                <input value="" placeholder="Type location longitude" name="shops" type="number">
                <button type="button" onclick="onDeleteShop(${nextAvailableId})">
                  <i class="bi bi-trash"></i> Remove
                </button>
            </li>`
        );
    } else {
        $('.edit-about .edit-shops ul').append(
            `               
                <li id="0">
                    <input value="" placeholder="Type location name" name="shops">
                    <input value="" placeholder="Type location address" name="shops">
                    <input value="" placeholder="Type location latitude" name="shops" type="number">
                    <input value="" placeholder="Type location longitude" name="shops" type="number">
                    <button type="button" onclick="onDeleteShop(0)"><i class="bi bi-trash"></i> Remove
                    </button>
                </li>`
        );
    }
    ++gNumOfShops;
    ++nextAvailableId;
}

function showAlert(message) {
    console.log('showAlert called with message:', message); // Log to ensure function is called
    const alertBox = $('#alert');
    alertBox.text(message);
    alertBox.show();
    setTimeout(() => {
        alertBox.hide();
        window.location.assign('/about');
    }, 3000);
}

function updateShops() {
    let i = 0;
    let idx = 0;
    // Get all the shops in DOM
    const inputs = $('.edit-about .edit-shops li input');
    if (!inputs) {
        gShops = [];
        return;
    }
    // Extract values and add to gShops variable
    inputs.each((_, input) => {
        const value = $(input).val();
        switch (i % fieldsPerShop) {
            case 0:
                gShops[idx] = { name: value || "" };
                break;
            case 1:
                gShops[idx].address = value || "";
                break;
            case 2:
                gShops[idx].lat = value || "";
                break;
            case 3:
                gShops[idx++].long = value || "";
                break;
        }
        i++;
    });
}

function onDeleteShop(id) {
    // Update local variable
    gNumOfShops--;
    // Remove the selected shop from the DOM
    $(`.edit-about .edit-shops li#${id}`).remove();
}

function areAllFieldsFilled() {
    let allFilled = true;
    $('.edit-about .edit-shops li input').each(function() {
        if ($(this).val() === '') {
            allFilled = false;
            return false; // Exit loop
        }
    });
    return allFilled;
}

async function onUpdateShops() {
    console.log('onUpdateShops called'); // Log to ensure function is called
    if (!areAllFieldsFilled()) {
        showNotice('Please fill in all fields before saving.');
        return;
    }
    updateShops();
    try {
        await $.ajax({
            url: '/about/edit-shops',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                shops: gShops
            }),
        })
        
        showNotice('Shops updated successfully!');
        // Leave edit mode and show the about page 
        window.location.assign('/about')
    } catch (e) {
        console.log('Could not save shops from frontend:', e);
        // TODO: Later show an error modal
    }
}
function showNotice(message, redirectToCart) {
    $('#noticeModalBody').text(message);
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {});
    noticeModal.show();

    setTimeout(function() {
        if (redirectToCart) {
            window.location.href = '/cart'; 
        } else {
            noticeModal.hide(); 
        }
    }, 300);
}

