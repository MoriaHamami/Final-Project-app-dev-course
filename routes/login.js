const express = require("express");
const router = express.Router();
const loginController = require("../controllers/login");

// For each route received, check method requested and send to relevant controller
router.route('/')
    .get(loginController.loginForm)
    .post(loginController.login);

router.route('/register')
    .get(loginController.registerForm)
    .post(loginController.register);

router.route('/logout')
    .get(loginController.logout);

// For later use:
// router.get('/secret', loginController.isLoggedIn, loginController.funcExampleForShowingSecretPage);

router.get('/user/details', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ username: req.user.username });
    } else {
        res.status(401).json({ error: 'User is not authenticated' });
    }
});

router.get('/isLogged', loginController.getPermissions);

module.exports = router;
