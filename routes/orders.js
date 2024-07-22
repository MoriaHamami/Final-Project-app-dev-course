const express = require('express');
const router = express.Router();
const { addCartToOrders } = require('../services/clients');

router.post('/add', async (req, res) => {
    console.log('POST /orders/add called'); // הודעת debug
    const username = req.session.username; // הנחה שהמשתמש מחובר וה-username שלו נשמר ב-session
    try {
        const result = await addCartToOrders(username);
        res.json(result);
    } catch (e) {
        res.json({ success: false, message: 'Error processing order' });
    }
});

module.exports = router;
