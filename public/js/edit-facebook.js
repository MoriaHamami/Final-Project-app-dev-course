// Global variables to store text and URL values
let gTxt = ''
let gURL = ''

// Function to update the text value
function onChangeTxt(newTxt) {
    // Update global variable gTxt with new value
    gTxt = newTxt
}

// Function to update the URL value
function onChangeURL(newURL) {
    // Update global variable gURL with new value
    gURL = newURL
}

// Function to handle Facebook post submission
async function facebookPost(ev) {
    // Prevent default form submission behavior
    ev.preventDefault()

    // Check if both inputs are filled
    if (!gTxt) {
        showNotice('All inputs must be filled.', false)
        return
    }

    try {
        // Send AJAX request to save new article
        const newArticle = await $.ajax({
            url: '/manager/edit-facebook', // Endpoint to handle Facebook post edit
            method: 'POST', // HTTP method
            contentType: 'application/json', // Content type for JSON data
            data: JSON.stringify({
                txt: gTxt, // Send text value
                linkURL: gURL // Send URL value
            }),
        })

        // If new article is successfully created
        if (newArticle?.id) {
            // Open Facebook profile in a new tab
            window.open("https://www.facebook.com/profile.php?id=61559829412060&locale=he_IL", '_blank')
            // Redirect to manager page after successful post
            window.location.assign('/manager')
        } else {
            // Log error if article creation failed
            console.log("Failed in DB", newArticle)
        }
    } catch (e) {
        // Log any errors that occur during the AJAX request
        console.log('Error:', e)
    }
}

function showNotice(message, redirectToCart) {
    $('#noticeModalBody').text(message); // Update modal body with message
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {}); // Initialize modal
    noticeModal.show(); // Show modal

    // Adding a delay before redirect or hiding modal
    setTimeout(function() {
        if (redirectToCart) {
            window.location.href = '/cart'; // Redirect to cart page
        } else {
            noticeModal.hide(); // Hide modal
        }
    }, 2000);
}
