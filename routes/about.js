const express = require("express")
const router = express.Router()

const aboutController = require("../controllers/about")

router.route('/')
    .get(aboutController.getAboutPage)

module.exports = router