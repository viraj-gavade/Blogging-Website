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
const OauthRouter = require("./Routes/Oauth2.router")
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
app.use('/',OauthRouter)

app.get('/', async (req,res)=>{
    const Blogs = await Blog.find({})
    console.log(Blogs)
    res.status(200).json({
        blogs:Blogs
    })
})


app.get('/',(req,res)=>{
    res.render('home')
})



const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is listining on PORT:-${PORT}`)
})
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