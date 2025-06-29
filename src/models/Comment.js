const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true 
    },
    authorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    postId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post' ,
    }
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema)