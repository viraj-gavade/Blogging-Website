require('dotenv').config();
const express = require('express');
const OauthRouter = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const Blog = require('../Models/blogs.models');
const USER = require('../Models/users.model');
const createuser = require('../Utils/CreatUser');
const { GenerateToken } = require('../Utils/authentication');
const JWT = require('jsonwebtoken')

// Google OAuth strategy configuration
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  }, (accessToken, refreshToken, profile, done) => {
      console.log(accessToken)
    // Proceed with profile
    return done(null, profile);
  })
);

// Serialize user info into session
passport.serializeUser((user, done) => {
  console.log('Serialize User:', user);
  done(null, user);
});

// Deserialize user info from session
passport.deserializeUser((user, done) => {
  console.log('Deserialize User:', user);
  done(null, user);
});

// Initiate Google OAuth flow
OauthRouter.get('/auth/google', (req, res, next) => {
  console.log('Initiating Google OAuth flow');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
OauthRouter.get('/auth/google/callback',async (req, res, next) => {
  console.log('Google OAuth callback triggered');
  next();
}, passport.authenticate('google', { failureRedirect: '/' }),
  async(req, res) => {
    console.log('Google OAuth Success - Redirecting to Profile');
    console.log('Logged In User Profile:', req.user); // Log profile after successful authentication
    
    const fullName = req.user.displayName; // Extract the user's display name
    const Useremail = req.user._json.email; // Extract the user's email

    console.log(`Name: ${fullName}`); // Log the user's name
    console.log(`Email: ${Useremail}`); // Log the user's email

    const Existing_User = await USER.findOne({email:Useremail})
    console.log(Existing_User)
    if(!Existing_User){
      const user = await USER.create({
        fullName:fullName,
        password:"Auth2-Login",
        email:Useremail,
      })
      console.log(user)
      const paylod = {
        fullname:user.fullName,
        _id:user._id,
        email:user.email,
        password:user.password,
        profileImageURL:user.profileImageURL,
        Role:user.role
      }

      const token = JWT.sign(paylod,process.env.JWT_SECRETE,{
        expiresIn:process.env.JWT_EXPIRY
      })
      console.log("Generated token for new user:", token)
     
      // Set cookie with proper options - USING CONSISTENT COOKIE NAME 'Token' (same as in signin.js)
      return res.cookie('Token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        path: '/',
        sameSite: 'lax', // Helps with cross-site requests
        // secure: true, // Uncomment this in production with HTTPS
      }).redirect('/');
    
    }
    
    // For existing user
    const paylod = {
      fullname:Existing_User.fullName,
      _id:Existing_User._id,
      email:Existing_User.email,
      password:Existing_User.password,
      profileImageURL:Existing_User.profileImageURL,
      Role:Existing_User.role
    }

    const token = JWT.sign(paylod,process.env.JWT_SECRETE,{
      expiresIn:process.env.JWT_EXPIRY
    })
    console.log("Generated token for existing user:", token)
    
    // Set cookie with consistent options - USING CONSISTENT COOKIE NAME 'Token' (same as in signin.js)
    return res.cookie('Token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      path: '/',
      sameSite: 'lax', // Helps with cross-site requests
      // secure: true, // Uncomment this in production with HTTPS
    }).redirect('/');
  }
);

// Debug route
OauthRouter.get('/signin', (req, res) => {
  res.send("Debug Statement");
});

// Add debug route to check authentication state
OauthRouter.get('/auth/check', (req, res) => {
  const token = req.cookies.Token;
  if (token) {
    try {
      const decoded = JWT.verify(token, process.env.JWT_SECRETE);
      res.json({
        authenticated: true,
        user: {
          name: decoded.fullname,
          email: decoded.email
        }
      });
    } catch (error) {
      res.json({ authenticated: false, error: 'Invalid token' });
    }
  } else {
    res.json({ authenticated: false, error: 'No token found' });
  }
});

// Protected profile route
OauthRouter.get('/profile', async (req, res) => {
  if (req.isAuthenticated()) {
    console.log('User is authenticated, rendering profile');
    console.log('Authenticated User Profile:', req.user); // Log user profile info
    const Blogs = await Blog.find({}).populate('title');
    res.render('home', {
      user: req.user,
      allblogs: Blogs
    });
  } else {
    console.log('User is not authenticated, redirecting to home');
    res.redirect('/');
  }
});

module.exports = OauthRouter;
