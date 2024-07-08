const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news");

router.route('/')
  .get(newsController.getNews)
  .post(newsController.createNew);

router.route('/edit')
  .get((req, res) => {
    res.render('edit-news.ejs', { article: null });
  })
  .post(newsController.createNew); // הוספנו כאן את הטיפול בבקשות POST

router.route('/edit/:id')
  .get(newsController.getNew)
  .put(newsController.updateNew)
  .delete(newsController.deleteNew);

module.exports = router;
