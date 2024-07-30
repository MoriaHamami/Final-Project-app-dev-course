var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var painting = false;
var currentColor = 'black'; // Default color
var toolbarOpen = false; // Is the toolbar open or closed
var gSize = "XS";
var img = new Image();

// Handle the onload event to ensure the image is fully loaded before drawing on it
img.onload = function () {
    // Draw the image on the canvas
    ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
}

canvas.addEventListener('mousedown', function (event) {
    painting = true;
    var rect = canvas.getBoundingClientRect(); // Get the absolute position of the canvas
    draw(event.clientX - rect.left, event.clientY - rect.top, false); // Adjust to the absolute mouse position
});

canvas.addEventListener('mousemove', function (event) {
    if (painting && !toolbarOpen) {
        var rect = canvas.getBoundingClientRect(); // Get the absolute position of the canvas
        draw(event.clientX - rect.left, event.clientY - rect.top, true); // Adjust to the absolute mouse position
    }
});

canvas.addEventListener('mouseup', function () {
    painting = false;
});

canvas.addEventListener('mouseleave', function () {
    painting = false;
});

function draw(x, y, isDrawing) {
    if (!isDrawing) {
        ctx.beginPath();
    }
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor; // Use currentColor variable as the color
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!isDrawing) {
        ctx.closePath();
    }
}

// Clear all changes and start over
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShirtFrame();
}

// Add event listener for the "Save Image" button
document.getElementById('saveBtn').addEventListener('click', async function () {
    var dataURL = canvas.toDataURL(); // Convert the canvas to a base64 image

    try {
        const response = await $.ajax({
            url: '/cart/canvas-edit',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ dataURL, color: currentColor, size: gSize })
        });
        window.location.assign('/cart');
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving image: ' + error.message);
    }
});

// Add event listener for the "Restart" button
document.getElementById('clearBtn').addEventListener('click', clearCanvas);

function updateSize(ev) {
    gSize = ev.target.value;
}

// Function to change the frame color
function changeFrameColor(color) {
    ctx.drawImage(frameImage, 50, 50, 400, 400); // Adjust the position and size of the image on the frame
    ctx.beginPath();
    ctx.rect(50, 50, 400, 400);
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.stroke();
}

// Function to change the shirt color
function changeShirtColor(color) {
    document.getElementById('myCanvas').style.backgroundColor = color;
}

// Function to draw text on the shirt
function drawText(text) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

// Global variable to hold the user's input text
var enteredText = '';

// Add event listener for the "Add Text" button
document.getElementById('addTextBtn').addEventListener('click', function () {
    if (enteredText.trim() !== '') {
        drawText(enteredText);
        enteredText = '';
        document.getElementById('textInput').value = '';
    }
});

// Add event listener for text input
document.getElementById('textInput').addEventListener('input', function () {
    enteredText = this.value;
});

// Function to draw a sketch on the shirt
function drawSketch(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
}

// Add event listeners for the color picker buttons
document.querySelectorAll('.color').forEach(function (button) {
    button.addEventListener('click', function () {
        currentColor = this.style.backgroundColor;
    });
});

// Add event listener for drawing on the shirt
canvas.addEventListener('mousedown', function (event) {
    var rect = canvas.getBoundingClientRect(); // Get the absolute position of the canvas
    drawSketch(event.clientX - rect.left, event.clientY - rect.top); // Adjust to the absolute mouse position
});

function drawShirtFrame() {
    var shirtImage = new Image();
    shirtImage.src = '../styles/imgs/general/shirt.svg'; // Assuming this is the path to your image
    shirtImage.onload = function () {
        ctx.drawImage(shirtImage, 0, 0, canvas.width, canvas.height); // Adjust the position and size as desired
    }
}

window.addEventListener('load', function () {
    drawShirtFrame();
});
