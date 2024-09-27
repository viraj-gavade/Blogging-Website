const express = require('express')
const { PostBlog } = require('../Controllers/blogs.controllers')
const upload = require('../Middlewares/multer.middleware')

const BlogRouter = express.Router()


BlogRouter.route('/addblog')
.post(upload.single('CoverImageURL'),PostBlog)

BlogRouter.route('/addblog').get((req,res)=>{
    res.render('addBlog',{
        user:req.user
    })
})    
 
// BlogRouter.route('/:BlogId')
// .get(GetSingleBlog)
// .patch(UpdateBlog)
// .delete(DeleteBlog)    


module.exports={
    BlogRouter 
}