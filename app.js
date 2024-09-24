const express = require("express")
const path = require('path')
//Creating an expressapp
const app = express()
const connectDB = require('./Database/connect')
const { url } = require("inspector")

//Some Middleware Setups
app.set('view engine','ejs')
app.set('views',path.resolve('./views'))


app.get('/test',(req,res)=>{
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