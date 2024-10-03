require('dotenv').config();
const express = require('express');
const OauthRouter = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const Blog = require('../Models/blogs.models');

// Google OAuth strategy configuration
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  }, (accessToken, refreshToken, profile, done) => {
    // Log Google profile and tokens
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
    console.log('Google Profile:', profile);

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
OauthRouter.get('/auth/google/callback', (req, res, next) => {
  console.log('Google OAuth callback triggered');
  next();
}, passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Google OAuth Success - Redirecting to Profile');
    console.log('Logged In User Profile:', req.user); // Log profile after successful authentication
    res.redirect('/profile');
  }
);

// Debug route
OauthRouter.get('/signin', (req, res) => {
  res.send("Debug Statement");
});

// Protected profile route
OauthRouter.get('/profile', async (req, res) => {
  if (req.isAuthenticated()) {
    console.log('User is authenticated, rendering profile');
    console.log('Authenticated User Profile:', req.user); // Log user profile info
    const Blogs = await Blog.find({}).populate('createdBy');
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
