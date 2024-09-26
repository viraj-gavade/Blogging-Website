const express = require('express')

const upload = require('../Middlewares/multer.middleware')

const BlogRouter = express.Router()


BlogRouter.route('/addblog')
.post(upload.single('CoverImageURL'),PostBlog)

BlogRouter.route('/').get((req,res)=>{
    res.render('addBlog')
})   
 
// BlogRouter.route('/:BlogId')
// .get(GetSingleBlog)
// .patch(UpdateBlog)
// .delete(DeleteBlog)    


module.exports={
    BlogRouter 
}