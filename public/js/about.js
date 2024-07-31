// Global variables
let gGenre = '';
let gTxt = '';
let gDate = '';

// Listeners for input changes
function onChangeGenre(newGenre) {
    gGenre = newGenre;
}

function onChangeTxt(newTxt) {
    gTxt = newTxt;
}

function onChangeDateTime(dateTime) {
    gDate = dateTime;
}

// Submit update for an existing article
async function onUpdateArticle(ev) {
    ev.preventDefault(); // Prevent default form submission

    try {
        await $.ajax({
            url: '/about/edit/' + $('#updateButton').val(), // URL for updating the article
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                genre: gGenre,
                txt: gTxt,
                date: gDate
            }),
        });

        showNotice('Article updated successfully.', '/about'); // Show success message and redirect
    } catch (e) {
        showNotice('An error occurred while updating the article.'); // Show error message
    }
}

// Delete an article
async function onDeleteArticle(id) {
    try {
        const res = await $.ajax({
            url: '/about/edit/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
        });

        if (res.status !== 404) {
            showNotice('Article deleted successfully.', '/about'); // Show success message and redirect
        } else {
            showNotice('Article could not be deleted.'); // Show failure message
        }
    } catch (e) {
        showNotice('An error occurred while deleting the article.'); // Show error message
    }
}

// Add a new article
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
        showNotice('An error occurred while adding the article.'); // Show error message
    }
}

// Search for news articles
async function searchNews() {
    const genre = $('#genreFilter').val();
    const text = $('#textFilter').val();
  
    try {
        const response = await $.ajax({
            url: '/about/search',
            method: 'GET',
            data: { genre, text },
            dataType: 'html'
        });
  
        const newContent = $(response).find('#newsResults').html();
        $('#newsResults').html(newContent); 
    } catch (e) {
        // Handle error during search
    }
}

// Show notice modal with a message and optional redirect
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
