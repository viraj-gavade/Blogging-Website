const express = require('express')
const { PostBlog,GetAllBlogs ,GetSingleBlog,createComment} = require('../Controllers/blogs.controllers')
const upload = require('../Middlewares/multer.middleware')
const VerifyJwt = require('../Middlewares/auth.middleware')
const Blogs = require('../Models/blogs.models')
const BlogRouter = express.Router()

BlogRouter.route('/addblog')
  .get((req, res) => {
    res.render('addBlog', {
      user: req.user  
    });
  })
  .post(VerifyJwt, upload.single('CoverImageURL'), PostBlog);  // Handle the POST request
 

BlogRouter.route('/allBlogs').get(async (req,res)=>{
    try {
        console.log(req.user)
        const Blog = await Blogs.find({}).populate('title')
        console.log(Blog)
        return res.json(Blog)
    } catch (error) {
        console.log(error)
    }
})
 
BlogRouter.route('/:BlogId')
.get(GetSingleBlog)
  
BlogRouter.route('/comment/:BlogId')
.post(VerifyJwt,createComment)



module.exports={
    BlogRouter 
}