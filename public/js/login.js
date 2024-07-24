async function fetchUserDetails() {
    try {
      const response = await fetch('/user/details'); // ניתן להתאים את ה-URL למיקום הנכון של ה-API שלך
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const user = await response.json();
      const signinButton = document.getElementById('signin-button');
      if (signinButton) {
        signinButton.textContent = `שלום, ${user.username}`; // החלפת הטקסט בכפתור SIGN IN
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  }

  // קריאה לפונקציה עם טעינת הדף
  fetchUserDetails();