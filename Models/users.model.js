const mongoose = require('mongoose')
const { type } = require('os')
const USER = require('../Models/users.model')
const { createHmac,randomBytes } = require('crypto');
const { GenerateToken } = require('../Utils/authentication')
  

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
      
    },
    password:{
        type:String,
        require:false
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



UserSchema.pre('save', function (next) {
    const user = this;

    // Check if the password is modified
    if (!user.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = randomBytes(16).toString();  
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex'); 

    // Store the salt and hashed password
    user.salt = salt;
    user.password = hashedPassword;

    next();  // Call next to proceed with saving
});

UserSchema.static('matchpasswordAndGenerateToken', async function (email,password) {
    const user =  await this.findOne({email})
    if(!user){
        throw new Error("User not found!")
    }

    const UserSalt = user.salt
    const hashedPassword = user.password

    //Check if user has provided the correct password

    const UserProvidedPassword  = createHmac('sha256', UserSalt)
    .update(password)
    .digest('hex');

    if(UserProvidedPassword !==hashedPassword ){
        throw new Error("Incorrect password proovided!")
    }

    const token = GenerateToken(user)
    return token
})

module.exports = mongoose.model('User',UserSchema)