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
        CoverImageURL:CoverImageURL,
        createdBy:req.user
    })

    return res.render('home')
}

module.exports = {
    PostBlog
}