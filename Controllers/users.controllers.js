const USER = require('../Models/users.model')
const mongoose = require('mongoose')

//Controller to signup the user.
const SignUpUser = async (req,res)=>{
    const { fullName , email ,password } = req.body
    console.log(req.body)
    if(!fullName || ! email ||!password){
        return res.status(401).json({
            status:"OK",
            message:"Please provide all the required fields!"
        })
    }

    const user = await USER.create({
        fullName:fullName,
        password:password,
        email:email,
    })
    return res.render('./home')
}

//Controller to signin the user

const SignInUser = async(req,res)=>{ 
    const { email ,password } = req.body
    const user = await USER.matchpassword(email,password)

    console.log("User",user)
    
    return res.render('./home')
}

module.exports ={
    SignUpUser,
    SignInUser
}