function onAddImg(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    reader.onload = function (e) {
      $('#image-preview').attr('src', e.target.result);
      $('#imgURL').val(e.target.result);
    };
  }
}

function submitForm() {
  const form = $('#registerForm')[0];
  const formData = new FormData(form);

  const data = {
    fullname: formData.get('fullname'),
    username: formData.get('username'),
    password: formData.get('password'),
    imgURL: formData.get('imgURL')
  };

  $.ajax({
    url: '/login/register',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(response) {
      window.location.href = '/';
    },
    error: function(jqXHR) {
      const result = jqXHR.responseJSON;
      showError(result ? result.error : 'Registration failed');
    }
  }).catch(error => {
    console.error('Error:', error);
    showError('Registration failed due to a network error');
  });
}

function showError(message) {
  const errorDiv = $('<div></div>')
    .addClass('alert alert-danger')
    .attr('role', 'alert')
    .text(message);

  $('#error-container').empty().append(errorDiv);
}