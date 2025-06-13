const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment.controller')
const {auth} = require('../middlewares/auth.middleware')

router.post('/', [auth], commentController.createComment)
router.get('/:postId', [auth], commentController.getCommentsByPost)
router.delete('/:id', [auth], commentController.deleteComment)

module.exports = router