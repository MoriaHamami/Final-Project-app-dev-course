const express = require("express")
const router = express.Router()

const loginController = require("../controllers/login")
const User = require('../models/user'); // ניתן לשנות את השם לפי הקובץ שלך

//  For each route recieved, check method requested and send to relevant controller
router.route('/register')
    .get(loginController.registerForm)
    .post(loginController.register)
router.route('/')
    .get(loginController.loginForm)
    .post(loginController.login)
router.route('/logout')
    .get(loginController.logout)
// For later use:
// router.get('/', loginController.isLoggedIn, loginController.funcExampleForShowingSecretPage);

router.get('/user/details', (req, res) => {
    if (req.isAuthenticated()) {
      // אם המשתמש מחובר, נחזיר את פרטי המשתמש
      res.json({ username: req.user.username }); // ניתן להתאים את המידע שמוחזר לפי צרכי האפליקציה שלך
    } else {
      // אם המשתמש לא מחובר, נחזיר שגיאה או פעולה נוספת לטיפול במצב זה
      res.status(401).json({ error: 'User is not authenticated' });
    }
  });
  
module.exports = router
