const USER = require('../Models/users.model')
const mongoose = require('mongoose')
const Blog = require('../Models/blogs.models')
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
    return res.render('signin')
}

//Controller to signin the user

const SignInUser = async(req,res)=>{ 
    const { email ,password } = req.body
try {
        const token = await USER.matchpasswordAndGenerateToken(email,password)
        const Blogs = await Blog.find({}).populate('createdBy')
        console.log(Blogs)
        console.log("User",token)
        

        return res.cookie('Token',token).render('home',{
            user:req.user,
            allblogs:Blogs
        })
    } catch (error) {
    
    return res.render('signin',{
        error:"Incorrect Email or pasword"
    })
}
}

const SignOut = async (req,res)=>{
   return  res.clearCookie('Token').redirect('/api/v1/user/signup')
}
module.exports ={
    SignUpUser,
    SignInUser,
    SignOut
}