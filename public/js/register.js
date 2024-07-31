// Function to handle image file input and preview
function onAddImg(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.readAsDataURL(input.files[0]); // Read the file as a data URL
    reader.onload = function (e) {
      $('#image-preview').attr('src', e.target.result); // Set the image preview
      $('#imgURL').val(e.target.result); // Set the image URL in a hidden input
    };
  }
}

// Function to submit the registration form
function submitForm() {
  const form = $('#registerForm')[0];
  const formData = new FormData(form);
  // Get the image URL or set a default image
  const imgSrc = formData.get('imgURL') ? formData.get('imgURL') : "profile.png";
  
  // Create an object with form data
  const data = {
    fullname: formData.get('fullname'),
    username: formData.get('username'),
    password: formData.get('password'),
    imgURL: imgSrc
  };

  // Send the data via AJAX POST request
  $.ajax({
    url: '/login/register',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(response) {
      window.location.href = '/'; // Redirect on success
    },
    error: function(jqXHR) {
      const result = jqXHR.responseJSON;
      showError(result ? result.error : 'Registration failed'); // Show error message
    }
  }).catch(error => {
    showError('Registration failed due to a network error'); // Handle network errors
  });
}

// Function to show error messages
function showError(message) {
  const errorDiv = $('<div></div>')
    .addClass('alert alert-danger')
    .attr('role', 'alert')
    .text(message);
 
  $('#error-container').empty().append(errorDiv); // Display the error message
}
