const mongoose = require('mongoose')


const BlogSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },

    CoverImageURL:{
        type:String,
        required:false,
        default:""
    },


},{
    timestamps:true
})

module.exports = mongoose.model('Blog',BlogSchema)