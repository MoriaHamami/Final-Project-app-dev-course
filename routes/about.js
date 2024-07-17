const express = require("express")
const router = express.Router()

const aboutController = require("../controllers/about")

router.route('/')
    .get(aboutController.getAboutPage)
router.route('/edit')
    .get(aboutController.getEditAboutPage)
    .put(aboutController.updateShops)

module.exports = router