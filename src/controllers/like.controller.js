const Like = require('../models/Like')
const Post = require('../models/Post')
const mongoose = require('mongoose')
const response = require('../helpers/helpers')

class LikeController {
    addLike = async (req, res) => {
        try {
            const { postId } = req.params

            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).json(response.responseError("Invalid post ID"))
            }

            const post = await Post.findById(postId)
            if (!post) {
                return res.status(404).json(response.responseError("Post not found"))
            }

            const like = await Like.findOne({ userId: req.user.id, postId })

            if (like) {
                return res.status(200).json(response.responseSuccess("You already liked this post"))
            }

            const newLike = await Like.create({ userId: req.user.id, postId })

            await Post.findByIdAndUpdate(postId, { $push: { likes: req.user.id } })

            res.status(201).json(response.responseSuccess("Post liked successfully", newLike))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }

    removeLike = async (req, res) => {
        try {
            const { postId } = req.params

            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).json(response.responseError("Invalid post ID"))
            }

            const like = await Like.findOneAndDelete({ userId: req.user.id, postId })

            if (!like) {
                return res.status(404).json(response.responseError("Like not found"))
            }

            await Post.findByIdAndUpdate(postId, { $pull: { likes: req.user.id } })

            res.status(200).json(response.responseSuccess("Like removed successfully"))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }
}

module.exports = new LikeController()
