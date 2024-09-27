const express = require('express')
const {SignUpUser,SignInUser,SignOut} = require('../Controllers/users.controllers')
const UserRouter = express.Router()


UserRouter.route('/signup').post(SignUpUser).get((req,res)=>{
    res.render('signup')
})
UserRouter.route('/signin').post(SignInUser).get((req,res)=>{
    res.render('signin')
})
UserRouter.route('/signout').get(SignOut)




module.exports = UserRouter