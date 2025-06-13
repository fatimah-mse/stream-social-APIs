const User = require("../models/User")
const argon2 = require("argon2")
const jwt = require("jsonwebtoken")
const response = require('../helpers/helpers')

const generateToken = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET_KEY)
}

class AuthController {
    
    signup = async (req, res) => {
        try {
            const { name, email, password } = req.body

            if (!name || !email || !password) {
                return res.status(400).json(response.responseError("All data must be entered"))
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
                return res.status(400).json(response.responseError("Invalid email format"))
            }

            const exist = await User.findOne({ email })
            if (exist) {
                return res.status(400).json(response.responseError("Email already exists"))
            }

            const hashedPassword = await argon2.hash(password)
            const user = await User.create({ name, email, password: hashedPassword })
            const token = generateToken({ id: user._id, email: user.email })

            return res.status(201).json(response.responseSuccess("Signup successful", {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }))
        } catch (err) {
            return res.status(500).json(response.responseError(err.message))
        }
    }

    login = async (req, res) => {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json(response.responseError("All data must be entered"))
            }

            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json(response.responseError("Email does not exist"))
            }

            const isPasswordCorrect = await argon2.verify(user.password, password)
            if (!isPasswordCorrect) {
                return res.status(400).json(response.responseError("Email or password is incorrect"))
            }

            const token = generateToken({ id: user._id })

            return res.status(200).json(response.responseSuccess("Login successful", {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }))
        } catch (err) {
            return res.status(500).json(response.responseError(err.message))
        }
    }

    logout = async (req, res) => {
        try {
            return res.status(200).json(response.responseSuccess("Logged out successfully"))
        } catch (error) {
            return res.status(500).json(response.responseError(error.message))
        }
    }
}

module.exports = new AuthController()
