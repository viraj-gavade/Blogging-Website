const express = require('express')
const {SignUpUser,SignInUser,SignOut} = require('../Controllers/users.controllers')
const UserRouter = express.Router()


UserRouter.route('/signup').post(SignUpUser)
UserRouter.route('/signin').post(SignInUser)
UserRouter.route('/signout').get(SignOut)



module.exports = UserRouter