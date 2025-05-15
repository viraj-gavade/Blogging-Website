require('dotenv').config()
const express = require("express");
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const cookieParser  = require('cookie-parser');
const connectDB = require('./Database/connect');
const UserRouter = require('./Routes/users.route');
const { checkusertoken } = require("./Middlewares/auth.middleware");
const { BlogRouter } = require("./Routes/blogs.route");
const OauthRouter = require("./Routes/Oauth2.router");
const Blog = require('./Models/blogs.models');
const {ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const cors = require('cors');
const bodyParser = require('body-parser');
const { Query } = require('mongoose');
const USER = require('./Models/users.model')
const mongoose = require('mongoose');
const VerifyJwt = require('./Middlewares/auth.middleware');
const AsyncHanlder = require('./Utils/AsyncHanlder')

// Create an express app
const app = express()

// // Middleware setups
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// Update CORS configuration for better flexibility
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://yourdomain.com' 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(session({
    secret: process.env.SECRETE,
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// Serve static files properly (like uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// User and Blog Routes
app.use('/api/v1/user', UserRouter);
app.use('/api/v1/blog', BlogRouter);

// OAuth Router - Fix: Mount the entire router, not just a single route
app.use('/', OauthRouter);  // This makes /auth/google available

// Improved production setup for serving the frontend
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app build directory
  const frontendBuildPath = path.join(__dirname, '../Frontend/dist');
  app.use(express.static(frontendBuildPath));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api') || 
        req.path.startsWith('/v1') || 
        req.path.startsWith('/auth') || 
        req.path.startsWith('/graphql')) {
      return next();
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Connect to the database
const connectdb = async () => {
    try {
        app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
        await connectDB();
        console.log('Connected to the database');
    } catch (error) {
        console.log('Database connection error:', error);
    }
};

connectdb();

