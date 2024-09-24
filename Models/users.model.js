const mongoose = require('mongoose')
const { type } = require('os')


const UserSchema = new mongoose.Schema({

    fullName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    salt:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    profileImageURL:{
        type:String,
        default:'/images/default.png'
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }
},
{
    timestamps:true
})

module.exports = mongoose.model('User',UserSchema)