const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news");
const loginController = require("../controllers/login");

router.route('/')
  .get(newsController.getNews)
  .post(newsController.createNew);
  // .post(loginController.isManagerLoggedIn,newsController.createNew);

router.route('/edit')
  .get((req, res) => {
    res.render('edit-news.ejs', { article: null });
  })
  .post(newsController.createNew); // הוספנו כאן את הטיפול בבקשות POST
  // .get(loginController.isManagerLoggedIn,(req, res) => {
  //   res.render('edit-news.ejs', { article: null });
  // })
  // .post(loginController.isManagerLoggedIn,newsController.createNew); // הוספנו כאן את הטיפול בבקשות POST

router.route('/edit/:id')
  .get(newsController.getNew)
  .put(newsController.updateNew)
  .delete(newsController.deleteNew);
  // .get(loginController.isManagerLoggedIn,newsController.getNew)
  // .put(loginController.isManagerLoggedIn,newsController.updateNew)
  // .delete(loginController.isManagerLoggedIn,newsController.deleteNew);

router.route('/search')
  .get(newsController.searchNews);

module.exports = router;
