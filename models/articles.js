const articles = [
    { id: 1, title: "art1" },
    { id: 2, title: "art2" }
]


async function getAllArticles() {
    // return articles

    const {MongoClient} = require('mongodb')
    // Connect URI
    const uri = 'mongodb://127.0.0.1:27017/'
    const client = new MongoClient(uri)
    await client.connect()
    const articles = await client.db('RealMadrid').collection('articles').find()
    return articles.toArray()
}

function getArticle(id) {
    const foundArticles = articles.filter(article => id == article.id)
    return foundArticles[0]
}

function deleteArticle(idToDel) {
    const idxToDel = articles.findIndex(article => article.id == idToDel)
    articles.splice(idxToDel, 1)
}

module.exports = { getAllArticles, getArticle, deleteArticle }