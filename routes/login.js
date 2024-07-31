const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");

// login form
router.route('/')
    .get(loginController.loginForm) // GET request to show login form
    .post(loginController.login); // POST request to handle login

// registration form
router.route('/register')
    .get(loginController.registerForm) // GET request to show registration form
    .post(loginController.register); // POST request to handle registration

// logging out
router.route('/logout')
    .get(loginController.logout); // GET request to handle logout

// For later use: example route that requires user to be logged in
// router.get('/secret', loginController.isLoggedIn, loginController.funcExampleForShowingSecretPage)

// Route for getting user details if authenticated
router.get('/user/details', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ username: req.user.username }); // Respond with username if user is authenticated
    } else {
        res.status(401).json({ error: 'User is not authenticated' }); // error 
    }
});

// Route to check if a user is logged in
router.get('/isLogged', loginController.getPermissions); // GET request to check login status

module.exports = router;
