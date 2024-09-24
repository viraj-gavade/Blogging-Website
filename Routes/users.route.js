const express = require('express')
const {SignUpUser} = require('../Controllers/users.controllers')
const UserRouter = express.Router()


UserRouter.route('/signup').post(SignUpUser).get((req,res)=>{
    res.render('signup')
})
// UserRouter.route('/signin').post(LoginUser)
// UserRouter.route('/logout').post(LogoutUser)


module.exports = UserRouter