import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import BlogCard from './BlogCard';

const BlogList = ({ blogs: externalBlogs }) => {
  // Sample blog data - use provided blogs (props) or default to sample data
  const [blogs, setBlogs] = useState(externalBlogs || [
    {
      id: '1',
      title: 'Getting Started with React and Tailwind CSS',
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '2',
      title: 'Modern Backend Development with Node.js and Express',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '3',
      title: 'Implementing Authentication Using JWT and OAuth',
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '4',
      title: 'Building Responsive UIs with Modern CSS Techniques',
      coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
  ]);

  // Clear blogs for testing empty state
  // Uncomment this line to test empty state
  // useEffect(() => { setBlogs([]); }, []);

  // Check URL parameters for notifications
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action) {
      switch (action) {
        case 'login_success':
          toast.success('Logged in successfully!');
          break;
        case 'blog_posted':
          toast.success('Your blog was posted!');
          break;
        case 'comment_added':
          toast.success('Comment added successfully!');
          break;
        default:
          break;
      }
      
      // Clean URL after showing notification (without refreshing the page)
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 animate__animated animate__fadeIn">Latest Articles</h1>
      
      {blogs && blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate__animated animate__fadeIn">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="empty-state bg-white rounded-lg p-8 text-center shadow-sm animate__animated animate__fadeIn">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles yet</h3>
          <p className="text-gray-500">Be the first to share your thoughts!</p>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default BlogList;
