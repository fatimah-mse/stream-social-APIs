const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    postId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post'
    }
}, { timestamps: true })

likeSchema.index({ userId: 1, postId: 1 }, { unique: true }) 

module.exports = mongoose.model('Like', likeSchema)