const clientsService = require('../services/clients');
const productsService = require('../services/products');
const loginService = require('../services/login');

// Func renders the manager page
async function getManagerPage(req, res) {
    try {
        const loggedInUser = req.session.username
        
        const managerInfo = await clientsService.getClientByUsername(loggedInUser)
        res.render('manager.ejs', { manager: managerInfo })
    } catch (e) {
        console.log('e:', e)
    }
}

async function getFacebookEditPage(req, res) {
    try {
        
        res.render('edit-facebook.ejs', { key:123 })
    } catch (e) {
        console.log('e:', e)
    }
}

async function getStats(req, res){
    try {        
        const clientStats = await clientsService.getStats()
        const productStats = await productsService.getStats()
        // console.log('managerInfo:', stats)
        const stats = {productStats, clientStats }
        res.json(stats)
    } catch (e) {
        console.log('e:', e)
    }

}

// FACEBOOK
async function facebookPost(req, res){

    const { txt, linkURL } = req.body;
    const API_BASE = 'https://graph.facebook.com/v15.0';
    
    // ===== MAKE POST ON PAGE =====
    const fbPostObj = {
        message: txt,
        link: linkURL ? linkURL : ''
        // link: 'https://www.google.com/imgres?q=img&imgurl=https%3A%2F%2Fcdn-imgix.headout.com%2Fmedia%2Fimages%2Fc9db3cea62133b6a6bb70597326b4a34-388-dubai-img-worlds-of-adventure-tickets-01.jpg%3Fauto%3Dformat%26w%3D814.9333333333333%26h%3D458.4%26q%3D90%26ar%3D16%253A9%26crop%3Dfaces&imgrefurl=https%3A%2F%2Fwww.imgworldstickets.com%2Fimg-worlds-plan-your-visit%2F&docid=0ynKpGBOsdPJEM&tbnid=KF0CLfOd4wQ76M&vet=12ahUKEwidtu-Dhs-HAxXNSfEDHVDDC-IQM3oECGgQAA..i&w=733&h=458&hcb=2&ved=2ahUKEwidtu-Dhs-HAxXNSfEDHVDDC-IQM3oECGgQAA'
    };
    // link: 'https://IMAGE-LINK'
     
     const postResp = await fetch(`${API_BASE}/${process.env.FACEBOOK_ID}/feed?access_token=${process.env.FACEBOOK_API}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fbPostObj)
     });
    
    const post = await postResp.json();
    res.json(post)
    // const postId = post.id;
  }

module.exports = {
    getManagerPage,
    getStats,
    getFacebookEditPage,
    facebookPost
} 
