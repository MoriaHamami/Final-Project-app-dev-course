async function fetchUserDetails() {
  try {
      const response = await fetch('/user/details'); // ניתן להתאים את ה-URL למיקום הנכון של ה-API שלך
      if (!response.ok) {
          throw new Error('Failed to fetch user details');
      }
      const user = await response.json();
      const signinButton = document.getElementById('signin-button');
      if (signinButton) {
          signinButton.textContent = `Hello, ${user.username}`; // החלפת הטקסט בכפתור SIGN IN
      }
  } catch (error) {
      console.error('Error fetching user details:', error);
      showNotice('Error fetching user details');
  }
}

// קריאה לפונקציה עם טעינת הדף
fetchUserDetails();


function showNotice(message, redirectToCart = false) {
  document.getElementById('noticeModalBody').innerText = message;
  var noticeModal = new bootstrap.Modal(document.getElementById('noticeModal'), {});
  noticeModal.show();

  // Adding a delay before redirect
  setTimeout(function() {
      if (redirectToCart) {
          window.location.href = '/cart'; // Redirect to the cart page after 1 second
      } else {
          noticeModal.hide();
      }
  }, 2000);
}

