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

//heck if input field is empty
function areFieldsEmpty() {
    return gGenre.trim() === '' || gTxt.trim() === '' || gDate.trim() === '';
}

// update for an existing article
async function onUpdateArticle(ev) {
    ev.preventDefault(); // Prevent form submission

    if (areFieldsEmpty()) {
        showNotice('All fields must be filled out.');
        return;
    }

    try {
        await $.ajax({
            url: '/about/edit/' + $('#updateButton').val(),
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                genre: gGenre,
                txt: gTxt,
                date: gDate
            }),
        });

        showNotice('Article updated successfully.');
    } catch (e) {
        showNotice('An error occurred while updating the article.');
    }
}

// Function to delete an article
async function onDeleteArticle(id) {
    try {
        const res = await $.ajax({
            url: '/about/edit/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
        });

        if (res.status !== 404) {
            showNotice('Article deleted successfully.', '/about');
        } else {
            showNotice('Article could not be deleted.');
        }
    } catch (e) {
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
        await $.ajax({
            url: '/about/edit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                genre: gGenre,
                txt: gTxt,
                date: gDate
            }),
        });

        showNotice('New article added successfully.', '/about');
    } catch (e) {
        showNotice('An error occurred while adding the article.');
    }
}

// Function to show a notification modal
function showNotice(message, redirectTo = false) {
    $('#noticeModalBody').text(message); // Set the message in the modal
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {}); // Initialize and show the modal

    // Redirect after a delay
    setTimeout(function() {
        if (redirectTo) {
            window.location.href = redirectTo;
        } else {
            noticeModal.hide();
        }
    }, 2000);
}
