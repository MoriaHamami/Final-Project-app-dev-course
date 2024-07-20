const express = require('express');
const router = express.Router();
const faveController = require('../controllers/fave');

// Log to check if routes are being initialized
console.log("Initializing /fave routes...");

router.route('/')
    .get((req, res, next) => {
        console.log('GET /fave called');
        next();
    }, faveController.getFavePage);

router.route('/add')
    .post(faveController.addFaveItem);
    // .get(faveController.getFavePage)
    router.route('/canvas-edit')
    .post(faveController.addEditShirtToFave)

router.route('/remove')
    .post(faveController.removeFaveItem);

module.exports = router;
