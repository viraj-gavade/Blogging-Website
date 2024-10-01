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

// Create an express app
const app = express();

// Middleware setups
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(session({
    secret: process.env.SECRETE,
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

// Use middleware to check the user token
app.use(checkusertoken('Token'));

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.get('/', async (req, res) => {
    const Blogs = await Blog.find({}).populate('createdBy');
    res.render('home', {
        user: req.user,
        allblogs: Blogs
    });
});

// User and Blog Routes
app.use('/api/v1/user', UserRouter);
app.use('/api/v1/blog', BlogRouter);

// OAuth Router
app.use('/', OauthRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
});

// Connect to the database
const connectdb = async () => {
    try {
        await connectDB();
        console.log('Connected to the database');
    } catch (error) {
        console.log('Database connection error:', error);
    }
};

connectdb();
