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
         return res.status(400).json({
             success: false,
             message: "Please provide all the required fields!"
         });
     }
 
     const user = await USER.create({
         fullName: fullName,
         password: password,
         email: email,
     })

     return res.status(201).json({
         success: true,
         message: "Account created successfully",
         user: {
             id: user._id,
             fullName: user.fullName,
             email: user.email
         }
     });
   } catch (error) {
    console.log(error)
    
    return res.status(500).json({
        success: false,
        message: "Failed to create account",
        error: error.message
    });
   }
}

// Controller that signins user with email and password
const SignInUser = asyncHandler(async(req, res) => { 
    try {
        const { email, password } = req.body
        const token = await USER.matchpasswordAndGenerateToken(email, password)
        console.log('Generated token for signin:', token)
        
        // Find user info
        const user = await USER.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Set cookie
        res.cookie('Token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
            path: '/',
            sameSite: 'lax',
            // secure: true, // Uncomment in production with HTTPS
        });
        
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
    catch (error) {
        console.log("Error in sign in:", error)
        
        return res.status(401).json({
            success: false,
            message: "Incorrect email or password"
        });
    }
})

// Controller to signout the user
const SignOut = asyncHandler(async (req, res) => {
   try {
       res.clearCookie('Token');
       
       return res.status(200).json({
           success: true,
           message: "Logged out successfully",
           redirectUrl: "/user/signin"
       });
   } catch (error) {
       console.log(error)
       
       return res.status(500).json({
           success: false,
           message: "Failed to log out"
       });
   }
})

// Controller to check authentication status
const CheckAuthStatus = asyncHandler(async (req, res) => {
    try {
        if (req.user) {
            return res.status(200).json({
                isAuthenticated: true,
                user: {
                    id: req.user._id,
                    fullName: req.user.fullName,
                    email: req.user.email
                }
            });
        }
        
        return res.status(200).json({
            isAuthenticated: false,
            message: "User not authenticated"
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return res.status(500).json({
            isAuthenticated: false,
            message: "Error checking authentication status"
        });
    }
});

module.exports = {
    SignUpUser,
    SignInUser,
    SignOut,
    CheckAuthStatus
}