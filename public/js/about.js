// Global variables to store input changes
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
    ev.preventDefault();

    try {
        await $.ajax({
            url: '/about/edit/' + $('#updateButton').val(), // Use jQuery to get the value of updateButton
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                genre: gGenre,
                txt: gTxt,
                date: gDate
            }),
        });

        showNotice('Article updated successfully.', '/about');
    } catch (e) {
        console.log('Error:', e);
        showNotice('An error occurred while updating the article.');
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
            showNotice('Article deleted successfully.', '/about');
        } else {
            showNotice('Article could not be deleted.');
        }
    } catch (e) {
        console.log('Error:', e);
        showNotice('An error occurred while deleting the article.');
    }
}

// Add a new article
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

        showNotice('New article added successfully.', '/about');
    } catch (e) {
        console.log('Error:', e);
        showNotice('An error occurred while adding the article.');
    }
}

async function searchNews() {
    const genre = $('#genreFilter').val(); // Use jQuery to get the value of genreFilter
    const text = $('#textFilter').val(); // Use jQuery to get the value of textFilter
  
    try {
      const response = await $.ajax({
        url: '/about/search', // Ensure this is the correct URL
        method: 'GET',
        data: { genre, text },
        dataType: 'html'
      });
  
      // Extract the new HTML for #newsResults and replace the existing content
      const newContent = $(response).find('#newsResults').html(); // Assuming #newsResults is the correct ID in your about.ejs
      $('#newsResults').html(newContent); // Use jQuery to set the new content of newsResults
    } catch (e) {
      console.log('Error searching news:', e);
    }
  }
  



// Example function for loading genres
function loadGenres() {
    // Add your logic here to load genres
}

// Show notice modal with a message and optional redirect
function showNotice(message, redirectTo = false) {
    $('#noticeModalBody').text(message); // Use jQuery to set the text of noticeModalBody
    var noticeModal = new bootstrap.Modal($('#noticeModal')[0], {}); // Use jQuery to get the noticeModal element
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
