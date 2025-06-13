const express = require('express')
const router = express.Router()
const {auth} = require('../middlewares/auth.middleware')
const resetController = new (require('../controllers/reset.controller'))

router.put('/', [auth], resetController.resetAccount)

module.exports = router
