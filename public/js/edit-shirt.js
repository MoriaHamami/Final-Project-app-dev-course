var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var painting = false;
// var undoStack = [];
// var redoStack = [];
var currentColor = 'black'; // הגדרת צבע ברירת מחדל
var toolbarOpen = false; // האם הסרגל כלים פתוח או סגור

var img = new Image();

// נקבע את נתיב התמונה
// img.src = 'public/js/מסגרת לתמונה2 .jpg';


// מתייחסים לאירוע onload כדי לוודא שהתמונה נטענה לגמרי לפני ביצוע כל פעולה עליה
img.onload = function () {
    // הדפסת רוחב התמונה
    // console.log('Width: 500' + img.naturalWidth);
    // הדפסת גובה התמונה
    // console.log('Height:500 ' + img.naturalHeight);

    // ציור התמונה על ה-Canvas
    ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
    // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

};

canvas.addEventListener('mousedown', function (event) {
    painting = true;
    draw(event.pageX - this.offsetLeft, event.pageY - this.offsetTop, false);
});

canvas.addEventListener('mousemove', function (event) {
    if (painting && !toolbarOpen) {
        draw(event.pageX - this.offsetLeft, event.pageY - this.offsetTop, true);
    }
});

canvas.addEventListener('mouseup', function () {
    painting = false;
    // saveState();
    // console.log('undotack.length:', undoStack.length)
});

canvas.addEventListener('mouseleave', function () {
    painting = false;
    // saveState();
    // console.log('undotack.length:', undoStack.length)
});

function draw(x, y, isDrawing) {
    if (!isDrawing) {
        ctx.beginPath();
    }
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor; // השימוש במשתנה currentColor כצבע
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!isDrawing) {
        ctx.closePath();
    }
}

// שמירת מצב נוכחי
// function saveState() {
//     undoStack.push(canvas.toDataURL());
//     redoStack = [];
// }

// החזרה למצב קודם
// function undo() {
//     console.log('undotack.length:', undoStack.length)
//     if (undoStack.length > 0) {

//         redoStack.push(canvas.toDataURL());
//         var dataURL = undoStack.pop();
//         var img = new Image();
//         // console.log('dataURL:', dataURL)
//         img.onload = function() {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         };
//         img.src = dataURL
//         // img.src = dataURL;
//     }
// }

// החזרה למצב הבא
// function redo() {
//     if (redoStack.length > 0) {
//         undoStack.push(canvas.toDataURL());
//         var dataURL = redoStack.pop();
//         var img = new Image();
//         img.src = dataURL
//         img.onload = function() {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//         };
//         // img.src = dataURL;
//     }

// }
// פונקציה לפתיחה וסגירה של סרגל הצבעים
// function toggleColorPicker() {
//     var colorPicker = document.getElementById('colorPicker');
//     colorPicker.style.display = (colorPicker.style.display === 'block') ? 'none' : 'block';
// }

// מחיקת כל השינויים והתחלה מחדש
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // undoStack = [];
    // redoStack = [];
    drawShirtFrame()
}

// הוספת אירוע לחיצה על הכפתור "שמור את התמונה"
document.getElementById('saveBtn').addEventListener('click', async function () {
    var dataURL = canvas.toDataURL(); // המרת ה-Canvas לתמונה בפורמט בסיס 64
    // var link = document.createElement('a'); // יצירת קישור
    // link.href = dataURL; // הוספת המידע לקישור
    // link.download = 'myPainting.png'; // הוספת השם לקובץ שישורר
    // link.click(); // לחיצה על הקישור על מנת להוריד את התמונה
    try {
        const response = await $.ajax({
            url: '/cart/canvas-edit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({dataURL, color:currentColor})
        });
        alert(response);
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving image: ' + error.message);
    }
    


});

// הוספת אירוע לחיצה על הכפתור "ביטול"
// document.getElementById('undoBtn').addEventListener('click', undo);

// הוספת אירוע לחיצה על הכפתור "החזרה"
// document.getElementById('redoBtn').addEventListener('click', redo);

// הוספת אירוע לחיצה על הכפתור "התחל מחדש"
document.getElementById('clearBtn').addEventListener('click', clearCanvas);
// הוספת אירוע ללחיצה על הכפתור "בחר צבע" לפתיחה וסגירה של סרגל הצבעים
// document.getElementById('colorBtn').addEventListener('click', toggleColorPicker);
// function drawShirtFrame() {
//     // ציור המסגרת בצורת חולצה קצרה עם שרוולים
//     ctx.fillStyle = 'brown'; // צבע החולצה
//     ctx.fillRect(100, 100, 200, 200); // ציור החולצה עם שרוולים
//     ctx.fillStyle = 'white'; // צבע השרוולים
//     ctx.fillRect(70, 100, 30, 200); // ציור השרוול השמאלי
//     ctx.fillRect(300, 100, 30, 200); // ציור השרוול הימני
// }

// טעינת תמונת המסגרת
// var frameImage = new Image();
// frameImage.src = '../styles/imgs/general/shirt.svg'; // כאן יש להזין את נתיב התמונה של המסגרת

// הוספת אירוע טעינת התמונה
// frameImage.onload = function() {
//     // ציור התמונה על ה-Canvas
//     ctx.drawImage(frameImage, 50, 50, 400, 400); // הסמן והגודל של התמונה על המסגרת
// };

// פונקציה לשינוי צבע המסגרת
function changeFrameColor(color) {
    // ציור התמונה על ה-Canvas מחדש עם הצבע החדש
    ctx.drawImage(frameImage, 50, 50, 400, 400); // הסמן והגודל של התמונה על המסגרת
    // ציור מלבן על התמונה - כדי להוסיף אפשרות לצייר עליה או לבצע פעולות נוספות
    ctx.beginPath();
    ctx.rect(50, 50, 400, 400);
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.stroke();
}
// פונקציה לשינוי צבע החולצה
function changeShirtColor(color) {
    // השמת צבע הרקע של המסגרת לצבע הנבחר
    document.getElementById('myCanvas').style.backgroundColor = color;
}
// הוספת אירוע ללחיצה על הכפתור "צבע חולצה" כדי לפתוח את בחירת הצבעים
// document.getElementById('colorShirt').addEventListener('click', function() {
//     var colorShirtPicker = document.getElementById('colorShirtPicker');
//     // החלפת תצוגת הכפתורים בין גלוי למוסתר
//     colorShirtPicker.style.display = (colorShirtPicker.style.display === 'block') ? 'none' : 'block';
// });

// קוד כתיבת טקסט על החולצה
function drawText(text) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}
// משתנה global שמכיל את הטקסט המוזן על ידי המשתמש
var enteredText = '';

// הוספת אירוע לחיצה על הכפתור "הוסף טקסט"
document.getElementById('addTextBtn').addEventListener('click', function () {
    // בדיקה האם יש טקסט להוספה
    if (enteredText.trim() !== '') {
        // ציור הטקסט על המסגרת
        drawText(enteredText);
        // ניקוי הטקסט מהשדה הנכון
        enteredText = '';
        document.getElementById('textInput').value = '';
    }
});

// הוספת אירוע להקלדת טקסט
document.getElementById('textInput').addEventListener('input', function () {
    // שמירת הטקסט שהוזן על ידי המשתמש
    enteredText = this.value;
});

// קוד סימון על החולצה
function drawSketch(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
}

// הוספת אירוע לחיצה על הכפתורים בסרגל הצבעים
document.querySelectorAll('.color').forEach(function (button) {
    button.addEventListener('click', function () {
        currentColor = this.style.backgroundColor;
    });
});

// הוספת אירוע ללחיצה על החולצה כדי לצייר עליה
canvas.addEventListener('mousedown', function (event) {
    var mouseX = event.pageX - this.offsetLeft;
    var mouseY = event.pageY - this.offsetTop;

    drawSketch(mouseX, mouseY);
});


function drawShirtFrame() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    //   קוד לציור התמונה על הקנבס
    var shirtImage = new Image();
    shirtImage.src = '../styles/imgs/general/shirt.svg'; // נניח שזה הנתיב לתמונה שלך
    shirtImage.onload = function () {
        // ציור התמונה על ה-Canvas
        ctx.drawImage(shirtImage, 0, 0, canvas.width, canvas.height); // אפשר לשנות את המיקום והגודל כרצונך
    };
}

window.addEventListener('load', function () {
    drawShirtFrame();
});
