const express = require('express')
const articleController = require('./controllers/articles')

// Create the server
const server = express()

// Static folder called public 
// will be given if nothing else is requested
server.use(express.static('public'))

// Routes
server.get('/', articleController.getAllArticles)
server.get('/article', articleController.getArticle)
server.get('/deleteArticle', articleController.deleteArticle)

server.listen(80)