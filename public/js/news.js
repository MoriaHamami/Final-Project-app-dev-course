// משתנים גלובליים לשמירת שינויים בקלטים
let gGenre = '';
let gTxt = '';
let gDate = '';

// מאזינים לשינויים בקלטים
function onChangeGenre(newGenre) {
    gGenre = newGenre;
}

function onChangeTxt(newTxt) {
    gTxt = newTxt;
}

function onChangeDateTime(dateTime) {
    gDate = dateTime;
}

// שליחת עדכון של כתבה קיימת
async function onUpdateArticle(ev) {
    ev.preventDefault();

    try {
        await $.ajax({
            url: '/news/edit/' + $('#updateButton').val(),
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                genre: gGenre,
                txt: gTxt,
                date: gDate
            }),
        });

        showNotice('Article updated successfully.', '/news');
    } catch (e) {
        console.log('Error:', e);
        showNotice('An error occurred while updating the article.');
    }
}

// מחיקת כתבה
async function onDeleteArticle(id) {
    try {
        const res = await $.ajax({
            url: '/news/edit/' + id,
            method: 'DELETE',
            contentType: 'application/json',
            data: JSON.stringify({ id }),
        });

        if (res.status !== 404) {
            showNotice('Article deleted successfully.', '/news');
        } else {
            showNotice('Article could not be deleted.');
        }
    } catch (e) {
        console.log('Error:', e);
        showNotice('An error occurred while deleting the article.');
    }
}

// הוספת כתבה חדשה
async function onAddArticle(ev) {
    ev.preventDefault();

    try {
        const newArticle = await $.ajax({
            url: '/news/edit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                genre: gGenre,
                txt: gTxt,
                date: gDate
            }),
        });

        showNotice('New article added successfully.', '/news');
    } catch (e) {
        console.log('Error:', e);
        showNotice('An error occurred while adding the article.');
    }
}

async function searchNews() {
    const genre = document.getElementById('genreFilter').value;
    const text = document.getElementById('textFilter').value;

    try {
        const response = await $.ajax({
            url: '/news/search',
            method: 'GET',
            data: { genre, text },
            dataType: 'html'
        });

        // Extract the new HTML for #newsResults and replace the existing content
        const newContent = $(response).find('#newsResults').html();
        $('#newsResults').html(newContent);
    } catch (e) {
        console.log('Error searching news:', e);
    }
}



function loadGenres() {
    // פונקציה לדוגמא לטעינת ז'אנרים
    // תוסיף כאן את הלוגיקה שלך לטעינת ז'אנרים
}

function showNotice(message, redirectTo = false) {
    document.getElementById('noticeModalBody').innerText = message;
    var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
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

// Function to navigate to the ticket edit page based on the ticket ID
// function getEditNewsPage(event, newsId) {
//     event.stopPropagation()
//     window.location.href = `/tickets/edit/${newsId}`;
// }
