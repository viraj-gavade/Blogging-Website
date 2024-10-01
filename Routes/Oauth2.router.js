require('dotenv').config()
const express = require('express')
const OauthRouter = express.Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const session = require('express-session')
const Blog = require('../Models/blogs.models')

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRETE,
    callbackURL: 'https://blogify-gr5rm1tg.b4a.run/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    // Find or create user in your DB here
    return done(null, profile);
  }));
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  
OauthRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
OauthRouter.get('/signin',(req,res)=>{
  res.send("Debug Statement")
})
// OAuth2 callback
OauthRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  });

// Protected profile route
OauthRouter.get('/profile', async (req, res) => {
  if (req.isAuthenticated()) {
    const Blogs = await Blog.find({}).populate('createdBy')
    res.render('home',{
            user:req.user,
            allblogs:Blogs
        })
  } else {
    res.redirect('/');
  }
});

module.exports = OauthRouter