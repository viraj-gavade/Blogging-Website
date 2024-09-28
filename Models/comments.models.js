const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    CommentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    CommentOn:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog" 
    }
},{
  timestamps:true
})

module.exports = mongoose.model('Comment',CommentSchema)