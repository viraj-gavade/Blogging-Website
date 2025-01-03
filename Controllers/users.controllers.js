const USER = require('../Models/users.model')
const mongoose = require('mongoose')
const Blog = require('../Models/blogs.models')
const asyncHandler = require('../Utils/AsyncHanlder')


//Controller that sign ups the user with Email Password and FullName.
const SignUpUser = async (req,res)=>{
   try {
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
   } catch (error) {
    console.log(error)
   }
}

//Controller that signins user with email and password
const SignInUser =asyncHandler( async(req,res)=>{ 
    try {
    const { email ,password } = req.body
        const token = await USER.matchpasswordAndGenerateToken(email,password)
        console.log('token',token)
        const Blogs = await Blog.find({})
        console.log(Blogs)
        console.log("User",token)
        

        return res.cookie('Token',token).redirect('/api/v1/blog/allBlogs')
        }
    catch (error) {
    
        console.log(error)
    return res.render('signin',{
        error:"Incorrect Email or pasword"
    })
}
})


//Controller to signout the user
const SignOut = asyncHandler(async (req,res)=>{
   try {
    return  res.clearCookie('Token').redirect('/api/v1/user/signup')

   } catch (error) {
    console.log(error)
   }
}  )
module.exports ={
    SignUpUser,
    SignInUser,
    SignOut
}