const Comment = require('../models/Comment')
const Post = require('../models/Post')
const response = require('../helpers/helpers')
const Like = require('../models/Like')

class restController {
    resetAccount = async (req, res) => {
        try {
            const userId = req.user.id
            const myPosts = await Post.find({ authorId: userId })
            const myPostIds = myPosts.map(post => post._id)

            await Post.deleteMany({ authorId: userId })

            await Comment.deleteMany({ postId: { $in: myPostIds } })

            await Like.deleteMany({ postId: { $in: myPostIds } })

            await Comment.deleteMany({ authorId: userId })

            await Like.deleteMany({ userId: userId })

            await Post.updateMany(
                { likes: userId },
                { $pull: { likes: userId } }
            )

            return res.status(200).json(response.responseSuccess("Account reset successfully. All posts, comments, and likes have been deleted."))

        }
        catch (err) {
            console.error(err)
            return res.status(500).json(response.responseError(err.message))
        }
    }

}

module.exports = new restController()