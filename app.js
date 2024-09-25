const express = require("express")
const path = require('path')
//Creating an expressapp
const app = express()
const connectDB = require('./Database/connect')
const UserRouter = require('./Routes/users.route')
const cookieParser  = require('cookie-parser')
const {checkusertoken} = require("./Middlewares/auth")
//Some Middleware Setups
app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser ())
app.use(express.json())
app.use(checkusertoken('Token'));

app.get('/',(req,res)=>{
    res.render('home',{
        user:req.user
    })
})
app.use('/api/v1/user',UserRouter)

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