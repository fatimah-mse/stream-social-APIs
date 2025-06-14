const express = require('express')
const app = express()
const morgan = require("morgan")
const authRoutes = require('./routes/auth.routes')
const userRoutes = require('./routes/user.routes')
const postRoutes = require('./routes/post.routes')
const commentRoutes = require('./routes/comment.routes')
const LikeRoutes = require('./routes/like.routes')
const ResetRoutes = require('./routes/reset.routes')

app.use(express.json())
app.use(morgan("dev"))
// const cors = require("cors")

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/likes', LikeRoutes)
app.use('/api/reset', ResetRoutes)

module.exports = app