const USER = require('../Models/users.model')
const mongoose = require('mongoose')
const Blog = require('../Models/blogs.models')
const asyncHandler = require('../Utils/AsyncHanlder')

// Controller that sign ups the user with Email Password and FullName.
const SignUpUser = async (req, res) => {
   try {
     const { fullName, email, password } = req.body
     console.log(req.body)
     if(!fullName || !email || !password) {
         // Check if request expects JSON
         if (req.headers.accept && req.headers.accept.includes('application/json')) {
             return res.status(400).json({
                 success: false,
                 message: "Please provide all the required fields!"
             });
         }
         return res.status(401).json({
             status: "OK",
             message: "Please provide all the required fields!"
         })
     }
 
     const user = await USER.create({
         fullName: fullName,
         password: password,
         email: email,
     })

     // Return JSON for API requests
     if (req.headers.accept && req.headers.accept.includes('application/json')) {
         return res.status(201).json({
             success: true,
             message: "Account created successfully",
             user: {
                 id: user._id,
                 fullName: user.fullName,
                 email: user.email
             }
         });
     }
     
     return res.render('signin')
   } catch (error) {
    console.log(error)
    
    // Return JSON for API requests
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(500).json({
            success: false,
            message: "Failed to create account",
            error: error.message
        });
    }
    
    res.status(500).render('error', { message: 'Failed to create account' });
   }
}

// Controller that signins user with email and password
const SignInUser = asyncHandler(async(req, res) => { 
    try {
        const { email, password } = req.body
        const token = await USER.matchpasswordAndGenerateToken(email, password)
        console.log('Generated token for signin:', token)
        const Blogs = await Blog.find({})
        console.log("User blogs:", Blogs.length)
        
        // Find user info
        const user = await USER.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        
        // Set cookie
        res.cookie('Token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            path: '/',
            sameSite: 'lax',
            // secure: true, // Uncomment in production with HTTPS
        });
        
        // Return JSON for API requests
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email
                }
            });
        }
        
        return res.redirect('/api/v1/blog/allBlogs')
    }
    catch (error) {
        console.log("Error in sign in:", error)
        
        // Return JSON for API requests
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password"
            });
        }
        
        return res.render('signin', {
            error: "Incorrect Email or password"
        })
    }
})

// Controller to signout the user
const SignOut = asyncHandler(async (req, res) => {
   try {
       res.clearCookie('Token');
       
       // Return JSON for API requests
       if (req.headers.accept && req.headers.accept.includes('application/json')) {
           return res.status(200).json({
               success: true,
               message: "Logged out successfully"
           });
       }
       
       return res.redirect('/api/v1/user/signup')
   } catch (error) {
       console.log(error)
       
       // Return JSON for API requests
       if (req.headers.accept && req.headers.accept.includes('application/json')) {
           return res.status(500).json({
               success: false,
               message: "Failed to log out"
           });
       }
       
       res.status(500).render('error', { message: 'Failed to log out' });
   }
})

// Controller to check authentication status


module.exports = {
    SignUpUser,
    SignInUser,
    SignOut,
}