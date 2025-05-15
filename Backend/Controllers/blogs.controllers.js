const upload = require('../Middlewares/multer.middleware') 
const Blog = require('../Models/blogs.models')
const uploadFile = require('../Utils/cloudinary')
const Comment = require('../Models/comments.models');
const asyncHandler = require('../Utils/AsyncHanlder');

// Controller that creates the blog post
const PostBlog = async (req, res) => {
  try {
    console.log('RQ.USER', req.user);
    const { title, body } = req.body;
    console.log(req.body);

    const CoverImageLocalpath = req.file.path;
    if (!CoverImageLocalpath) {
      return res.status(400).json({
        success: false,
        message: 'Cover image is required'
      });
    }

    const CoverImageURL = await uploadFile(CoverImageLocalpath);
    if (!CoverImageURL.url) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image to Cloudinary'
      });
    }

    const blog = await Blog.create({
      title: title,
      body: body,
      CoverImageURL: CoverImageURL.url,
      AddedBy: req.user._id,
    });
    
    const blogs = await Blog.find({}).populate('title');
    
    return res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog,
      blogs
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'An error occurred while adding the blog'
    });
  }
};

// AddBlogPost controller for frontend form submission
const AddBlogPost = asyncHandler(async (req, res) => {
  try {
    const { title, body } = req.body;
    
    // Check if required fields are present
    if (!title || !body || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required (title, body, cover image)'
      });
    }
    
    // Process the file upload to Cloudinary
    const CoverImageLocalpath = req.file.path;
    const CoverImageURL = await uploadFile(CoverImageLocalpath);
    
    if (!CoverImageURL.url) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image to Cloudinary'
      });
    }
    
    // Create the blog post
    const blog = await Blog.create({
      title,
      body,
      CoverImageURL: CoverImageURL.url,
      AddedBy: req.user._id
    });
    
    // Return success JSON response
    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      blog: {
        id: blog._id,
        title: blog.title,
        coverImage: blog.CoverImageURL
      }
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  }
});

// Controller that gets all blog posts
const GetAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({}).populate('AddedBy', 'fullName');
    return res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
});

// Controller that gets a single blog and all of its comments
const GetSingleBlog = asyncHandler(async (req, res) => {
  try {
    const { BlogId } = req.params;
    const blog = await Blog.findById(BlogId).populate({
      path: 'AddedBy',
      select: 'fullName'
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    const comments = await Comment.find({
      CommentOn: BlogId
    }).populate({
      path: 'CommentBy',
      select: 'fullName'
    });
    
    return res.status(200).json({
      success: true,
      blog,
      comments
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
});

// Controller that creates a comment on the blog
const createComment = asyncHandler(async (req, res) => {
  try {
    const { BlogId } = req.params;
    const { content } = req.body;
    
    // Validate blog exists
    const blogExists = await Blog.findById(BlogId);
    if (!blogExists) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    const comment = await Comment.create({
      content: content,
      CommentBy: req.user._id,
      CommentOn: BlogId
    });
    
    // Get updated comments list
    const comments = await Comment.find({
      CommentOn: BlogId
    }).populate({
      path: 'CommentBy',
      select: 'fullName'
    });

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment,
      comments
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
});

// Exporting the controllers.
module.exports = {
  PostBlog,
  GetAllBlogs,
  GetSingleBlog,
  createComment,
  AddBlogPost
}