const express = require("express");
const router = express.Router();
const aboutController = require("../controllers/about");
const loginController = require("../controllers/login");

router.route('/')
  .get(aboutController.getAboutPage)
  // .post(aboutController.createNew);
  .post(loginController.isManagerLoggedIn,aboutController.createNew)
  router.route('/edit-shops')
  // .get(aboutController.getEditAboutPage)
  .get(loginController.isManagerLoggedIn,aboutController.getEditAboutPage)
  // .put(aboutController.updateShops)
  .put(loginController.isManagerLoggedIn,aboutController.updateShops)

router.route('/edit')
  // .get((req, res) => {
  //   res.render('edit-news.ejs', { article: null })
  // })
  // .post(aboutController.createNew) // הוספנו כאן את הטיפול בבקשות POST
  .get(loginController.isManagerLoggedIn,(req, res) => {
    res.render('edit-news.ejs', { article: null });
  })
  .post(loginController.isManagerLoggedIn,aboutController.createNew); // הוספנו כאן את הטיפול בבקשות POST

router.route('/edit/:id')
  // .get(aboutController.getNew)
  // .put(aboutController.updateNew)
  // .delete(aboutController.deleteNew);
  .get(loginController.isManagerLoggedIn,aboutController.getNew)
  .put(loginController.isManagerLoggedIn,aboutController.updateNew)
  .delete(loginController.isManagerLoggedIn,aboutController.deleteNew);

  router.route('/search')
  .get(aboutController.searchNews);


module.exports = router;
