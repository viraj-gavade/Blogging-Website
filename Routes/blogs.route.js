const express = require('express')
const { PostBlog,GetAllBlogs ,GetSingleBlog,createComment} = require('../Controllers/blogs.controllers')
const upload = require('../Middlewares/multer.middleware')
const VerifyJwt = require('../Middlewares/auth.middleware')

const BlogRouter = express.Router()


BlogRouter.route('/addblog')
.post(upload.single('CoverImageURL'),PostBlog)

BlogRouter.route('/addblog').get((req,res)=>{
    res.render('addBlog',{
        user:req.user
    })
})    

BlogRouter.route('/allBlogs').get(GetAllBlogs)
 
BlogRouter.route('/:BlogId')
.get(GetSingleBlog)
// .patch(UpdateBlog)
// .delete(DeleteBlog)    

BlogRouter.route('/comment/:BlogId')
.post(createComment)

BlogRouter.route('/Blogs')
.get(VerifyJwt, async (req, res) => {
    try {
        // Fetching expenses data for the logged-in user (from the JWT token)
        console.log('Req user id ', req.user.id); // Log the user's ID (for debugging)
        
        // Fetch all expenses, total expenses, and monthly expenses
        const AllBlogs = await GetAllBlogs(req.user.id); // Get all expenses for the user
        const user = await findUser(req.user.id); // Get the user details

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