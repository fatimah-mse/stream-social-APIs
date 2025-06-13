const express = require('express')
const router = express.Router()
const likeController = require('../controllers/like.controller')
const {auth} = require('../middlewares/auth.middleware')

router.post('/:postId', [auth], likeController.addLike)
router.delete('/:postId', [auth], likeController.removeLike)

module.exports = router
