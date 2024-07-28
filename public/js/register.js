
function onAddImg(input) {
  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.readAsDataURL(input.files[0]);
    reader.onload = function (e) {
      document.getElementById('image-preview').src = e.target.result;
      document.getElementById('imgURL').value = e.target.result;
    };
  }
}

function submitForm() {
  const form = document.getElementById('registerForm');
  const formData = new FormData(form);

  const data = {
    fullname: formData.get('fullname'),
    username: formData.get('username'),
    password: formData.get('password'),
    imgURL: formData.get('imgURL')
  };

  fetch('/login/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(async response => {
    const result = await response.json();
    if (response.ok) {
      window.location.href = '/';
    } else {
      // הצגת הודעת שגיאה
      showError(result.error || 'Registration failed');
    }
  }).catch(error => {
    console.error('Error:', error);
    showError('Registration failed due to a network error');
  });
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'alert alert-danger';
  errorDiv.role = 'alert';
  errorDiv.innerText = message;

  const errorContainer = document.getElementById('error-container');
  errorContainer.innerHTML = ''; // מנקה הודעות קודמות אם קיימות
  errorContainer.appendChild(errorDiv);
}
