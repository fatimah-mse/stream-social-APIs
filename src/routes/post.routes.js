const express = require('express')
const router = express.Router()
const postController = require('../controllers/post.controller')
const {pagination} = require('../middlewares/pagination.middleware')
const Post = require('../models/Post')
const {auth} = require('../middlewares/auth.middleware')

router.post('/', [auth], postController.createPost)
router.put('/:id', [auth], postController.updatePost)
router.delete('/:id', [auth], postController.deletePost)
router.get('/me', [auth], postController.getMyPosts)
router.get('/', [pagination(Post, {}, 'authorId')], postController.getPaginatedPosts)
router.get('/:id', postController.getSinglePost)
router.delete('/', [auth], postController.deleteMyPosts)

module.exports = router
