const clientsService = require('../services/clients') // Import clients service
const productsService = require('../services/products') // Import products service
const loginService = require('../services/login') // Import login service

// Function renders the manager page
async function getManagerPage(req, res) {
    try {
        const loggedInUser = req.session.username // Get the logged-in user's username
        const managerInfo = await clientsService.getClientByUsername(loggedInUser) // Fetch manager info by username
        res.render('manager.ejs', { manager: managerInfo }) // Render the manager page with manager info
    } catch (e) {
        console.log('Error fetching manager page:', e) // Log any errors
        res.status(500).send('Internal Server Error') // Send 500 status code
    }
}

// Function renders the Facebook edit page
async function getFacebookEditPage(req, res) {
    try {
        res.render('edit-facebook.ejs', { key:123 }) // Render the Facebook edit page with a key
    } catch (e) {
        console.log('Error rendering Facebook edit page:', e) // Log any errors
        res.status(500).send('Internal Server Error') // Send 500 status code
    }
}

// Function gets statistics for the manager page
async function getStats(req, res) {
    try {
        const clientStats = await clientsService.getStats() // Fetch client stats
        const productStats = await productsService.getStats() // Fetch product stats
        const stats = { productStats, clientStats } // Combine stats into an object
        res.json(stats) // Send stats as JSON response
    } catch (e) {
        console.log('Error fetching stats:', e) // Log any errors
        res.status(500).json({ error: 'Internal Server Error' }) // Send 500 status code with error message
    }
}

// Function handles Facebook post submission
async function facebookPost(req, res) {
    const { txt, linkURL } = req.body // Destructure text and link URL from request body
    const API_BASE = 'https://graph.facebook.com/v15.0' // Set base URL for Facebook API

    // Create an object for the Facebook post
    const fbPostObj = {
        message: txt, // Set message to text from request body
        link: linkURL ? linkURL : '' // Set link to URL from request body or empty string
    }

    try {
        // Send POST request to Facebook API
        const postResp = await fetch(`${API_BASE}/${process.env.FACEBOOK_ID}/feed?access_token=${process.env.FACEBOOK_API}`, {
            method: 'POST', // Use POST method
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            },
            body: JSON.stringify(fbPostObj) // Send Facebook post object as JSON
        })

        const post = await postResp.json() // Parse response JSON
        if (post.error) {
            throw new Error(post.error.message) // Throw error if response contains an error
        }
        res.json(post) // Send response as JSON
    } catch (e) {
        console.log('Error posting to Facebook:', e) // Log any errors
        res.status(500).json({ error: 'Internal Server Error' }) // Send 500 status code with error message
    }
}

// Function exports
module.exports = {
    getManagerPage, 
    getStats, 
    getFacebookEditPage, 
    facebookPost 
}
