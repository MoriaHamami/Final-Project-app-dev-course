// Global variables
let gGenre = '';
let gTxt = '';
let gDate = '';

// Event listeners for input changes
function onChangeGenre(newGenre) {
    gGenre = newGenre; // Update genre
}

function onChangeTxt(newTxt) {
    gTxt = newTxt; // Update text
}

function onChangeDateTime(dateTime) {
    gDate = dateTime; // Update date and time
}

// Check if all fields are empty
function areFieldsEmpty() {
    return gGenre.trim() === '' && gTxt.trim() === '' && gDate.trim() === '';
}

// Function to update an existing article
async function onUpdateArticle(ev) {
    ev.preventDefault(); // Prevent form submission

    if (areFieldsEmpty()) {
        showNotice('At least one field must be filled out.');
        return;
    }

    const dataToUpdate = {};
    if (gGenre.trim() !== '') dataToUpdate.genre = gGenre;
    if (gTxt.trim() !== '') dataToUpdate.txt = gTxt;
    if (gDate.trim() !== '') dataToUpdate.date = gDate;

    try {
        const response = await $.ajax({
            url: '/about/edit/' + $('#updateButton').val(),
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(dataToUpdate),
        });

        console.log("Article updated successfully:", response);
        showNotice('Article updated successfully.');
    } catch (e) {
        console.error("Error updating article:", e);
        showNotice('An error occurred while updating the article.');
    }
}

// Function to delete an article
async function onDeleteArticle(ev) {
    ev.preventDefault(); // Prevent form submission
    const id = ev.target.value;
    console.log("onDeleteArticle called with id:", id);

    try {
        const res = await $.ajax({
            url: '/about/edit/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
        });

        if (res.status !== 404) {
            console.log("Article deleted successfully");
            showNotice('Article deleted successfully.', '/about');
        } else {
            console.log("Article could not be deleted");
            showNotice('Article could not be deleted.');
        }
    } catch (e) {
        console.error("Error deleting article:", e);
        showNotice('An error occurred while deleting the article.');
    }
}

// Function to add a new article
async function onAddArticle(ev) {
    ev.preventDefault(); // Prevent form submission

    if (areFieldsEmpty()) {
        showNotice('All fields must be filled out.');
        return;
    }

    try {
        const response = await $.ajax({
            url: '/about/edit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                genre: gGenre,
                txt: gTxt,
                date: gDate
            }),
        });

        console.log("New article added successfully:", response);
        showNotice('New article added successfully.', '/about');
    } catch (e) {
        console.error("Error adding article:", e);
        showNotice('An error occurred while adding the article.');
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
            window.location.href = redirectTo;
        } else {
            noticeModal.hide();
        }
    }, 2000);
}
