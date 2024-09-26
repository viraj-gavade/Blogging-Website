const express = require('express')

const BlogRouter = express.Router()


BlogRouter.route('/addblog').post(PostBlog)

BlogRouter.route('/').get(GetAllBlogs)   
 
BlogRouter.route('/:BlogId')
.get(GetSingleBlog)
.patch(UpdateBlog)
.delete(DeleteBlog)    


module.exports={
    BlogRouter
}