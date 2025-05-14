import React from 'react';

const BlogCard = () => {
  // Simplified version with just one featured blog post as shown in the screenshot
  const blog = {
    id: 1,
    title: "Getting Started with React and Tailwind CSS",
    coverImage: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  };

  return (
    <div className="container-custom py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Latest Blog Posts</h2>
      
      <div className="grid">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          {/* Blog Image */}
          <img 
            src={blog.coverImage} 
            alt={blog.title} 
            className="w-full object-cover" 
            style={{ maxHeight: '400px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
