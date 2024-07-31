// Global variable
let gShops = [];

// number of shops based on the DOM
let gNumOfShops = $('.edit-about .edit-shops li').length || 0;
let nextAvailableId = gNumOfShops + 1;
const fieldsPerShop = 4;

// add a new shop to the list
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

//display an alert message
function showAlert(message) {
    const alertBox = $('#alert');
    alertBox.text(message);
    alertBox.show();
    setTimeout(() => {
        alertBox.hide();
        window.location.assign('/about');
    }, 2000); // Changed to 2000 milliseconds (2 seconds)
}

// update the global shops array with current values from the DOM
function updateShops() {
    let i = 0;
    let idx = 0;
    // Get all the shop input fields
    const inputs = $('.edit-about .edit-shops li input');
    if (!inputs) {
        gShops = [];
        return;
    }
    // Extract values and add them to gShops array
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

// Function to delete a shop by ID
function onDeleteShop(id) {
    // Update local variable
    gNumOfShops--;
    // Remove the shop from the DOM
    $(`.edit-about .edit-shops li#${id}`).remove();
    showNotice('Shops updated successfully!');
   
}

// Function to check if all input fields are filled
function areAllFieldsFilled() {
    let allFilled = true;
    $('.edit-about .edit-shops li input').each(function() {
        if ($(this).val() === '') {
            allFilled = false;
            return false; // 
        }
    });
    return allFilled;
}

// Function to update shop details
async function onUpdateShops() {
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
        });
        
        showNotice('Shops updated successfully!');
        // Redirect to the about page
        window.location.assign('/about');
    } catch (e) {
       // error 
    }
}

// Function to show a notification modal
function showNotice(message, redirectTo = false) {
    console.log("showNotice called with message:", message, "redirectTo:", redirectTo);
    
    $('#noticeModalBody').text(message); // Set the message in the modal
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {}); // Initialize and show the modal

    noticeModal.show(); // Show the modal

    // Redirect after a delay
    setTimeout(function() {
        if (redirectTo) {
            console.log("Redirecting to:", redirectTo);
            window.location.href = redirectTo;
        } else {
            console.log("Hiding notice modal");
            noticeModal.hide();
        }
    }, 2000);
}


function hideNotice() {
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {});
    noticeModal.hide();
}
