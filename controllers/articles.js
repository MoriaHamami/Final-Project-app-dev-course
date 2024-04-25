const articlesModel = require('../models/articles')

function getAllArticles(req, res) {
    const articles =  articlesModel.getAllArticles()
    res.render('articles.ejs',{articles})
}

function getArticle(req, res) {
    const articleId = req.query.id
    const article = articlesModel.getArticle(articleId)
    if(article == undefined) res.status(404).send('Article not found')
    else res.render('article.ejs', {article})
}

function deleteArticle(req, res) {
    const articleId = req.query.id
    articlesModel.deleteArticle(articleId)
    getAllArticles(req, res)
}

module.exports = {
    getAllArticles,
    getArticle,
    deleteArticle
}
