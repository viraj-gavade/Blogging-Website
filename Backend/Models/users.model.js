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

UserSchema.static('matchpasswordAndGenerateToken', async function (email, password) {
    try {
        const user = await this.findOne({email})
        console.log("Login attempt for email:", email)
        
        if (!user) {
            throw new Error("User not found!")
        }

        // Check if user has Google OAuth authentication only (no password)
        if (!user.password || !user.salt) {
            throw new Error("This account uses Google login. Please sign in with Google.")
        }

        const userSalt = user.salt
        const hashedPassword = user.password

        console.log("Verifying password...")

        // Check if user has provided the correct password
        const userProvidedPassword = createHmac('sha256', userSalt)
            .update(password)
            .digest('hex');

        console.log("Password match:", userProvidedPassword === hashedPassword)

        if (userProvidedPassword !== hashedPassword) {
            throw new Error("Incorrect password provided!")
        }

        const token = GenerateToken(user)
        console.log("Token generated successfully")
        return token
    } catch (error) {
        console.error("Authentication error:", error.message)
        throw error
    }
})

module.exports = mongoose.model('User',UserSchema)