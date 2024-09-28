const upload = require('../Middlewares/multer.middleware')
const Blog = require('../Models/blogs.models')
const uploadFile = require('../Utils/cloudinary')

const PostBlog = async (req,res)=>{
    const { title , body } = req.body

    const CoverImageLocalpath = req.file.path
    if(!CoverImageLocalpath){
        throw new Error('Cover image localpath not found!')
    }

    const CoverImageURL = await uploadFile(CoverImageLocalpath)
    if(!CoverImageURL.url){
        throw new Error('Something went wrong while uploading file on cloudinary!')

    }
    const blog = await Blog.create({
        title:title,
        body:body,
        CoverImageURL:CoverImageURL.url ,
        createdBy:req.user.fullName
    })
    const Blogs = await Blog.find({}).populate('createdBy')
    console.log(Blogs)
    return res.render('home',{
        user:req.user,
        allblogs:Blogs
    })
}

const GetAllBlogs = async (req,res)=>{
    const Blogs = await Blog.find({}).populate('createdBy')
    console.log(Blogs)
    return res.render('home',{
        user:req.user,
        allblogs:Blogs
    })
}
const GetSingleBlog = async (req,res)=>{
    const { BlogId } = req.params
    const Blogs = await Blog.findById(BlogId).populate({
        path: 'createdBy',
        select: 'fullName'  // Specify fields to populate
      })
    console.log(Blogs)
    return res.render('blog',{
        user:req.user,
        singleBlog:Blogs
    })
    
}
module.exports = {
    PostBlog,
    GetAllBlogs,
    GetSingleBlog
    
    

}