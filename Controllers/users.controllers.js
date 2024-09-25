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
try {
        const token = await USER.matchpasswordAndGenerateToken(email,password)
    
        console.log("User",token)
        
        return res.cookie('Token',token).render('./home')
    } catch (error) {
    
    return res.render('signin',{
        error:"Incorrect Email or pasword"
    })
}
}
module.exports ={
    SignUpUser,
    SignInUser
}