const mongoose = require('mongoose')
const { type } = require('os')

const { createHmac,randomBytes } = require('crypto');
  

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



UserSchema.pre('save', function (next) {
    const user = this;

    // Check if the password is modified
    if (!user.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = randomBytes(16).toString();  // Use 'hex' for a valid string representation
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    // Store the salt and hashed password
    user.salt = salt;
    user.password = hashedPassword;

    next();  // Call next to proceed with saving
});


module.exports = mongoose.model('User',UserSchema)