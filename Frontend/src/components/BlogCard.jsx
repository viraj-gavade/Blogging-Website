import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 text-black">
      <img 
        src={blog.CoverImageURL || blog.coverImage} 
        alt={`${blog.title} cover`} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col justify-between h-36">
        <h2 className="text-xl font-semibold mb-4 line-clamp-2">{blog.title}</h2>
        <Link 
          to={`/blog/${blog._id || blog.id}`} 
          className="bg-primary-600 text-white py-2 px-4 rounded text-center font-medium hover:bg-primary-700 transition-colors duration-300"
        >
          Read Article
        </Link>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    CoverImageURL: PropTypes.string,
    coverImage: PropTypes.string,
  }).isRequired,
};

export default BlogCard;
