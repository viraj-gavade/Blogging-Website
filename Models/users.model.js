const mongoose = require('mongoose')
const { type } = require('os')
const {
    createHash,randomBytes
  } = require('node:crypto');
  

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

UserSchema.pre('save',function (next) {
    const user = this
    if(!user.isModified()){
        return
    }

    const salt = randomBytes(16)
    const hashedpassword = createHash('sha256',salt).update(user.password).digest('hex')
    
    this.salt=salt
    this.password=hashedpassword
})

module.exports = mongoose.model('User',UserSchema)