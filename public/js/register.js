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

// Function to validate the form
function validateForm() {
  const form = $('#registerForm')[0];
  const formData = new FormData(form);

  if (!formData.get('fullname') || !formData.get('username') || !formData.get('password')) {
    showError('Please fill in all the fields before registering');
    return false;
  }
  return true;
}

// Function to submit the registration form
function submitForm() {
  if (!validateForm()) {
    return; // Exit if form is not valid
  }

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

  console.log('Data being sent:', data); // Log data for debugging

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
      if (result && result.error === 'username_exists') {
        showError('This username already exists in the system');
      } else {
        showError(result ? result.error : 'Registration failed'); // Show error message
      }
     
    }
  }).catch(error => {
    showError('This username already exists in the system'); //  Show error message
    
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
