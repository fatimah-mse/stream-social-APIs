const User = require("../models/User")
const Post = require("../models/Post")
const Comment = require("../models/Comment")
const Like = require("../models/Like")
const argon2 = require("argon2")
const response = require('../helpers/helpers')

class UserController {

    getMe = async (req, res) => {
        try {
            const user = await User.findById(req.user.id)

            res.status(200).json(response.responseSuccess("User profile fetched", {
                name: user.name,
                email: user.email
            }))
        } catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }

    updateMe = async (req, res) => {
        try {
            const { name, email, password, oldPassword } = req.body
            const user = await User.findById(req.user.id)

            if (!user) {
                return res.status(404).json(response.responseError("User not found"))
            }

            const trimmedName = name ? name.trim() : null
            const trimmedEmail = email ? email.trim() : null

            const wantsToChangeName = trimmedName && trimmedName !== user.name
            const wantsToChangeEmail = trimmedEmail && trimmedEmail !== user.email
            const wantsToChangePassword = !!password

            if ((wantsToChangeName || wantsToChangeEmail || wantsToChangePassword) && !oldPassword) {
                return res.status(400).json(response.responseError("You must provide your old password to update your profile"))
            }

            if (oldPassword) {
                const isMatch = await argon2.verify(user.password, oldPassword)
                if (!isMatch) {
                    return res.status(400).json(response.responseError("Old password is incorrect"))
                }
            }

            let isModified = false

            if (wantsToChangeName) {
                user.name = trimmedName
                isModified = true
            }

            if (wantsToChangeEmail) {
                user.email = trimmedEmail
                isModified = true
            }

            if (wantsToChangePassword) {
                user.password = await argon2.hash(password)
                isModified = true
            }

            if (!isModified) {
                return res.status(200).json(response.responseSuccess("No changes made", {
                    name: user.name,
                    email: user.email
                }))
            }

            await user.save()

            res.status(200).json(response.responseSuccess("Profile updated successfully", {
                name: user.name,
                email: user.email
            }))

        }
        catch (error) {
            res.status(500).json(response.responseError(error.message))
        }
    }

    deleteMe = async (req, res) => {
        try {
            const userId = req.user.id

            await Comment.deleteMany({ authorId: userId })

            const userPosts = await Post.find({ authorId: userId })
            const postIds = userPosts.map(post => post._id)

            await Comment.deleteMany({ postId: { $in: postIds } })
            await Like.deleteMany({ $or: [{ userId }, { postId: { $in: postIds } }] })
            await Post.updateMany({}, { $pull: { likes: userId } })
            await Post.deleteMany({ authorId: userId })
            await User.findByIdAndDelete(userId)

            res.status(200).json(response.responseSuccess("User and all related data deleted successfully"))
        }
        catch (err) {
            res.status(500).json(response.responseError(err.message))
        }
    }

}

module.exports = new UserController()
