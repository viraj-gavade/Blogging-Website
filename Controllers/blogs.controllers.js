const upload = require('../Middlewares/multer.middleware') //upload middleware for file uploads
const Blog = require('../Models/blogs.models')//Blog Model
const uploadFile = require('../Utils/cloudinary') // Cloudinary Middleware for public URL
const Comment = require('../Models/comments.models') // Comment Model



//Controller that creates the blog post and renders the home page
const PostBlog = async (req, res) => {
    try {
        console.log(req.user)
      console.log('RQ.USER', req.user);
      const { title, body } = req.body;
      console.log(req.body);
  
      const CoverImageLocalpath = req.file.path;
      if (!CoverImageLocalpath) {
        throw new Error('Cover image localpath not found!');
      }
  
      const CoverImageURL = await uploadFile(CoverImageLocalpath);
      if (!CoverImageURL.url) {
        throw new Error('Something went wrong while uploading file to Cloudinary!');
      }
  
      const blog = await Blog.create({
        title: title,
        body: body,
        CoverImageURL: CoverImageURL.url,
        AddedBy: req.user._id,
      });
      
      console.log(blog)
  
      const Blogs = await Blog.find({}).populate('title');
      return res.render('home', {
        user: req.user,
        allblogs: Blogs,
      });
    } catch (error) {
      console.log(error);
      return res.render('addBlog', { 
        user: req.user, 
        errorMessage: error.message || 'An error occurred while adding the blog.' 
      });
    }
  };
  


//Controller that gets all blog post and renders them on the front-end.
const GetAllBlogs = async (req,res)=>{
    try {
        console.log(req.user)
        const Blogs = await Blog.find({}).populate('title')
        return res.render('home',{
            user:req.user,
            allblogs:Blogs
        })
    } catch (error) {
        console.log(error)
    }
}

//Controller that get the single blog and all of its comments to read and renders it with Blog Page
const GetSingleBlog = async (req,res)=>{
   try {
     const { BlogId } = req.params
     const Blogs = await Blog.findById(BlogId).populate({
         path: 'title',
         select: 'fullName'  // Specify fields to populate
       })
       const AllCommets = await Comment.find({
         CommentOn:BlogId
       }).populate('CommentBy')
     return res.render('blog',{
         user:req.user,
         singleBlog:Blogs,
         comments:AllCommets
     })
     
   } catch (error) {
    console.log(error)
   }
}


//Controller that creates a comment on the blog
const createComment = async ( req,res)=>{
  try {
    console.log(req.user)
      const { BlogId } = req.params
      const { content } = req.body
      const comment = await Comment.create({
          content:content,
          CommentBy:req.user._id,
          CommentOn:BlogId
  
        })
        console.log(comment)
        
      const Blogs = await Blog.findById(BlogId).populate({
          path: 'title',
          select: 'fullName'  // Specify fields to populate
        })
        const AllCommets = await Comment.find({
          CommentOn:BlogId
        })


      return res.render('blog',{
          user:req.user,
          singleBlog:Blogs,
          comments:AllCommets
      })
  } catch (error) {
    console.log(error)
  }
}



//Exporting the controllers.
module.exports = {
    PostBlog,
    GetAllBlogs,
    GetSingleBlog,
    createComment
    
    

}