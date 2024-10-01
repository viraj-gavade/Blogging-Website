const express = require("express")
const path = require('path')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const session = require('express-session')
//Creating an expressapp
const app = express()
const connectDB = require('./Database/connect')
const UserRouter = require('./Routes/users.route')
const cookieParser  = require('cookie-parser')
const {checkusertoken} = require("./Middlewares/auth.middleware")
const { BlogRouter } = require("./Routes/blogs.route")
const Blog = require('./Models/blogs.models')
//Some Middleware Setups
app.set('view engine','ejs')
app.set('views',path.resolve('./views'))


app.use(session({
    secret:process.env.SECRETE,
    resave:false,
    saveUninitialized:true
}))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser ())
app.use(express.json())
app.use(checkusertoken('Token'));
app.use(passport.initialize())
app.use(passport.session())

app.use(session({
    secret:process.env.SECRETE,
    resave:false,
    saveUninitialized:true
}))
app.get('/',(req,res)=>{
    res.render('home',{
        user:req.user
    })
})
app.use('/api/v1/user',UserRouter)
app.use('/api/v1/blog',BlogRouter)

app.get('/', async (req,res)=>{
    const Blogs = await Blog.find({})
    console.log(Blogs)
    res.status(200).json({
        blogs:Blogs
    })
})

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRETE,
    callbackURL: 'http://localhost:3000/auth/google/callback'
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
// Google OAuth route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// OAuth2 callback
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  });


const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is listining on PORT:-${PORT}`)
})
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
      res.send(`Hello ${req.user.displayName}`);
    } else {
      res.redirect('/');
    }
  });
//Database connection

const connectdb = async()=>{
    try {
        connectDB()
        .then(()=>{
            console.log('server is listining on port:-',PORT)
        })
    } catch (error) {
        console.log(error)
    }
}


connectdb()