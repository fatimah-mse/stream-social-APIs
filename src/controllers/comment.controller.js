const Comment = require('../models/Comment')
const Post = require('../models/Post')
const mongoose = require('mongoose')
const response = require('../helpers/helpers')

class CommentController {

    createComment = async (req, res) => {
        try {
            const { content, postId } = req.body

            if (!content || !postId) {
                return res.status(400).json(response.responseError("Content and postId are required"))
            }

            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).json(response.responseError("Invalid post ID"))
            }

            const post = await Post.findById(postId)
            if (!post) {
                return res.status(404).json(response.responseError("Post not found"))
            }

            const comment = await Comment.create({
                content: content.trim(),
                authorId: req.user.id,
                postId
            })

            await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } })

            res.status(201).json(response.responseSuccess("Comment added successfully", comment))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }

    getCommentsByPost = async (req, res) => {
        try {
            const { postId } = req.params

            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).json(response.responseError("Invalid post ID"))
            }

            const comments = await Comment.find({ postId })
                .populate('authorId', 'name email')
                .sort({ createdAt: -1 })

            res.status(200).json(response.responseSuccess("Comments fetched successfully", comments))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }

    deleteComment = async (req, res) => {
        try {
            const { id } = req.params

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json(response.responseError("Invalid comment ID"))
            }

            const comment = await Comment.findById(id)
            if (!comment) {
                return res.status(404).json(response.responseError("Comment not found"))
            }

            if (comment.authorId.toString() !== req.user.id) {
                return res.status(403).json(response.responseError("Not authorized to delete this comment"))
            }

            await comment.deleteOne()

            await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: comment._id } })

            res.status(200).json(response.responseSuccess("Comment deleted successfully"))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }
}

module.exports = new CommentController()
