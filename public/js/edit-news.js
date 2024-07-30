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

// הוספת כתובת מקור של תמונה ל-gopImg (לא רלוונטי לעריכת כתבות)
function addTogSrcImgs(opImg) {
    // כאן תוכל להוסיף פונקציות נוספות לעריכת תמונה אם יהיה צורך
}

// שליחת עדכון של כתבה קיימת
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
        console.log('Error:', e);
        showNotice('An error occurred while updating the article.');
    }
}

// מחיקת כתבה
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

// הוספת כתבה חדשה
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

        showNotice('New article added successfully.', '/about'); // לשנות לכתובת המתאימה לעמוד הראשי של עמוד החדשות
    } catch (e) {
        console.log('Error:', e);
        showNotice('An error occurred while adding the article.');
    }
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
