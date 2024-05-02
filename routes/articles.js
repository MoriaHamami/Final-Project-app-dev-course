const express = require('express')
const router = express.Router()

const articleController = require('../controllers/articles')

// Routes
router.route('/').get(articleController.getAllArticles)
router.route('/article').get(articleController.getArticle)
router.route('/deleteArticle').get(articleController.deleteArticle)

module.exports = router