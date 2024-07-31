// Global variables to keep track of input changes
let gGenre = '';
let gTxt = '';
let gDate = '';

// Event listeners for input changes
function onChangeGenre(newGenre) {
    gGenre = newGenre;
}

function onChangeTxt(newTxt) {
    gTxt = newTxt;
}

function onChangeDateTime(dateTime) {
    gDate = dateTime;
}

// Function to add image source to gSrcImgs (not relevant for article editing)
function addTogSrcImgs(opImg) {
    // Here you can add additional functions for image editing if needed
}

// Function to send an update for an existing article
async function onUpdateArticle(ev) {
    ev.preventDefault();

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
    ev.preventDefault();

    try {
        const newArticle = await $.ajax({
            url: '/about/edit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                genre: gGenre,
                txt: gTxt,
                date: gDate
            }),
        });

        showNotice('New article added successfully.', '/about'); // Change to the appropriate URL for the main news page
    } catch (e) {
        showNotice('An error occurred while adding the article.');
    }
}

// Function to show a notification modal
function showNotice(message, redirectTo = false) {
    $('#noticeModalBody').text(message);
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {});
    noticeModal.show();

    // Adding a delay before redirect
    setTimeout(function() {
        if (redirectTo) {
            window.location.href = redirectTo; // Redirect to the specified URL
        } else {
            noticeModal.hide();
        }
    }, 2000);
}