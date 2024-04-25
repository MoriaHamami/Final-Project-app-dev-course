const articles = [
    { id: 1, title: "art1" },
    { id: 2, title: "art2" }
]


function getAllArticles() {
    return articles
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