const Post = require('../models/Post')
const mongoose = require('mongoose')
const response = require('../helpers/helpers')
const Like = require('../models/Like')
const Comment = require('../models/Comment')

class PostController {

    createPost = async (req, res) => {
        try {
            const { title, content } = req.body

            if (!title || !content) {
                return res.status(400).json(response.responseError('Title and content are required'))
            }

            const post = await Post.create({
                title: title.trim(),
                content: content.trim(),
                authorId: req.user.id
            })

            res.status(201).json(response.responseSuccess('Post created successfully', post))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }

    updatePost = async (req, res) => {
        try {
            const { id } = req.params
            const { title, content } = req.body

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json(response.responseError("Invalid post ID"))
            }

            const post = await Post.findById(id)
            if (!post) {
                return res.status(404).json(response.responseError("Post not found"))
            }

            if (!post.authorId || post.authorId.toString() !== req.user.id) {
                return res.status(403).json(response.responseError("Not authorized to edit this post"))
            }

            const newTitle = title?.trim()
            const newContent = content?.trim()

            const isTitleChanged = newTitle && newTitle !== post.title
            const isContentChanged = newContent && newContent !== post.content

            if (!isTitleChanged && !isContentChanged) {
                return res.status(200).json(response.responseSuccess("No changes made. Data is the same.", post))
            }

            if (isTitleChanged) post.title = newTitle
            if (isContentChanged) post.content = newContent

            await post.save()

            return res.status(200).json(response.responseSuccess("Post updated successfully", post))

        } catch (err) {
            return res.status(500).json(response.responseError(err.message))
        }
    }

    deletePost = async (req, res) => {
        try {
            const { id } = req.params
            const post = await Post.findById(id)

            if (!post) return res.status(404).json(response.responseError("Post not found"))

            if (post.authorId.toString() !== req.user.id) {
                return res.status(403).json(response.responseError("Not authorized to delete this post"))
            }

            await Comment.deleteMany({ postId: id })
            await Like.deleteMany({ postId: id })
            await post.deleteOne()

            res.status(200).json(response.responseSuccess("Post and related data deleted successfully"))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }


    getPaginatedPosts = async (req, res) => {
        try {
            res.status(200).json(response.responseSuccess("Posts fetched successfully", res.paginatedResults))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }

    getMyPosts = async (req, res) => {
        try {
            const posts = await Post.find({ authorId: req.user.id }).sort({ createdAt: -1 })
            res.status(200).json(response.responseSuccess("My posts fetched successfully", posts))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }

    getSinglePost = async (req, res) => {
        try {
            const { id } = req.params

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json(response.responseError("Invalid post ID"))
            }

            const post = await Post.findById(id).populate('authorId', 'name email')

            if (!post) return res.status(404).json(response.responseError("Post not found"))

            res.status(200).json(response.responseSuccess("Post fetched successfully", post))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }

    deleteMyPosts = async (req, res) => {
        try {
            const myPosts = await Post.find({ authorId: req.user.id })

            if (myPosts.length === 0) {
                return res.status(404).json(response.responseError("No posts found for this user"))
            }

            const postIds = myPosts.map(post => post._id)

            await Post.deleteMany({ authorId: req.user.id })
            await Comment.deleteMany({ postId: { $in: postIds } })
            await Like.deleteMany({ postId: { $in: postIds } })

            res.status(200).json(response.responseSuccess(`${postIds.length} post(s) and related data deleted successfully`))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }

}

module.exports = new PostController()