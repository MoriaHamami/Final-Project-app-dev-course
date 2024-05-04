const express = require('express')
const articlesRoutes = require('./routes/articles')
// Create the server
const server = express()

// Static folder called public 
// will be given if nothing else is requested
server.use(express.static('public'))

server.use("/", articlesRoutes)

server.listen(80)