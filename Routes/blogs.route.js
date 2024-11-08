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
        return res.render('home',{
            user:req.user,
            allblogs:Blog
        })
    } catch (error) {
        console.log(error)
    }
})
 
BlogRouter.route('/:BlogId')
.get(GetSingleBlog)
// .patch(UpdateBlog)
// .delete(DeleteBlog)    

BlogRouter.route('/comment/:BlogId')
.post(createComment)

BlogRouter.route('/allBlogs')
.get(VerifyJwt, async (req, res) => {
    try {
        
        const Blogs = await Blogs.find({})
        // Render the 'home' page with the fetched data
        return res.render('home', { allblog:AllBlogs, user });
    } catch (error) {
        // Catch and log errors during the process
        console.error('Error fetching expenses:', error);
        return res.status(500).send('Internal Server Error'); // Respond with a 500 error if something goes wrong
    }
})

module.exports={
    BlogRouter 
}