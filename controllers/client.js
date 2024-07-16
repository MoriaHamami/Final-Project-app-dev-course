// Func renders the client page
function getClientPage(req, res) { 
    res.render('client.ejs', {})
}

 function getEditShirt(req, res){
    res.render('edit-shirt.ejs', {})
}

module.exports = {
    getClientPage,
    getEditShirt
}