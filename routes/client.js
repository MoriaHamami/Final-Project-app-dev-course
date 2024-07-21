const express = require('express');
const router = express.Router();
const { getClientPage, getClientOrders } = require('../controllers/client');
const { isLoggedIn } = require('../controllers/login');

router.get('/', isLoggedIn, getClientPage);
router.get('/:id', isLoggedIn, getClientOrders);

module.exports = router;
