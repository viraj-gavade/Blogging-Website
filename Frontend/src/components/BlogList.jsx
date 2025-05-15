import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const BlogList = ({ blogs: propBlogs }) => {
  const [blogs, setBlogs] = useState(propBlogs || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check URL parameters for notifications
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'login_success') {
      toast.success('Successfully logged in!');
    } else if (action === 'blog_posted') {
      toast.success('Your blog has been published!');
    } else if (action === 'comment_added') {
      toast.success('Comment added successfully!');
    }
    
    // Clean URL after showing notification
    if (action) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // If blogs were not provided as props, fetch them from the API
    if (!propBlogs) {
      fetchBlogs();
    } else {
      setLoading(false);
    }
  }, [propBlogs]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/v1/blog/allBlogs', {
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      
      const data = await response.json();
      // Handle the array structure directly from your API
      setBlogs(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs. Please try again later.');
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-3xl font-bold mb-6 text-red-600">Error</h2>
        <p className="text-gray-700">{error}</p>
        <button 
          onClick={fetchBlogs}
          className="mt-4 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 animate__animated animate__fadeIn">Latest Articles</h1>
      
      {blogs && blogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate__animated animate__fadeIn">
          {blogs.map((blog) => (
            <div key={blog._id} className="blog-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <img 
                src={blog.CoverImageURL} 
                alt={`${blog.title} cover image`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between min-h-[10rem]">
                <h3 className="text-lg font-semibold mb-4 line-clamp-2">{blog.title}</h3>
                <div className="mt-auto">
                  <Link 
                    to={`/api/v1/blog/${blog._id}`} 
                    className="block bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 transition-all duration-300 text-center"
                  >
                    Read Article
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg animate__animated animate__fadeIn">
          <h3 className="text-xl font-semibold text-gray-700">No articles yet</h3>
          <p className="text-gray-500 mt-2">Be the first to share your thoughts!</p>
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
