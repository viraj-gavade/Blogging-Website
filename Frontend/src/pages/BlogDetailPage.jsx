import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get auth state from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("Error parsing stored user data", e);
      }
    }
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');

    // Fetch the blog data from API
    const fetchBlogData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/v1/blog/${id}`, {
          headers: {
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog (status ${response.status})`);
        }
        
        const data = await response.json();
        setBlog(data.blog);
        setComments(data.comments || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.message || 'Failed to load blog');
        toast.error('Failed to load blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();

    // Check URL for notification parameters
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'comment_added') {
      toast.success('Comment added successfully!');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      const response = await fetch(`/api/v1/blog/comment/${blog._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ content: commentText }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to post comment');
      }
      
      const data = await response.json();
      
      // Update comments with the new list from API
      setComments(data.comments || [...comments, data.comment]);
      setCommentText('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await fetch(`/api/v1/blog/comment/${commentId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete comment');
        }
        
        // Remove the deleted comment from state
        setComments(comments.filter(comment => comment._id !== commentId));
        toast.success('Comment deleted successfully!');
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error('Failed to delete comment');
      }
    }
  };

  const isCommentOwner = (comment) => {
    if (!currentUser || !comment.CommentBy) return false;
    
    // Compare user IDs
    const commentUserId = comment.CommentBy._id || comment.CommentBy.id;
    const currentUserId = currentUser._id || currentUser.id;
    
    return commentUserId === currentUserId;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-12"></div>
          <div className="h-64 bg-gray-300 rounded mb-8"></div>
          <div className="h-4 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error Loading Blog</h2>
        <p className="mb-6">{error || 'Blog not found'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
<>
      
    <div className="w-full max-w-3xl mx-auto px-4 my-8 md:my-16 animate__animated animate__fadeIn">
    
      <article className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-lg shadow-md mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-gray-100 leading-tight">
          {blog.title}
        </h1>
        
        <div className="text-gray-600 dark:text-gray-400 mb-8 text-sm flex items-center">
          <span className="inline-block w-1 h-1 rounded-full bg-gray-500 mr-2"></span>
          Posted on {blog.createdAt} by {blog.AddedBy.fullName}
        </div>
        
        <img 
          src={blog.CoverImageURL} 
          alt={`${blog.title} cover`}
          className="w-full max-h-96 object-cover rounded-lg mb-8 shadow-sm hover:transform hover:scale-[1.01] transition-transform"
        />
        
        <div className="prose prose-lg max-w-none dark:prose-invert">
          {blog.body.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-800 dark:text-gray-200">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
      
      <section className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-xl md:text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 relative">
          Comments
          <span className="absolute bottom-0 left-0 w-10 h-1 bg-primary-600 rounded-sm"></span>
        </h2>
        
        {comments.length > 0 ? (
          comments.map(comment => (
            <div 
              key={comment.id} 
              className="py-6 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 hover:-mx-4 hover:px-4 rounded-lg transition-all"
            >
              <div className="flex justify-between">
                <p className="mb-3 text-gray-800 dark:text-gray-200">{comment.content}</p>
                {isLoggedIn && isCommentOwner(comment) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                    title="Delete comment"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="inline-block mr-4">By {comment.CommentBy.fullName}</span>
                <span>Posted on {comment.createdAt}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No comments yet. Be the first to comment!</p>
        )}
      </section>
      
      {isLoggedIn && (
        <section className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
          <h2 className="text-xl md:text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 relative">
            Add a Comment
            <span className="absolute bottom-0 left-0 w-10 h-1 bg-primary-600 rounded-sm"></span>
          </h2>
          
          <form onSubmit={handleCommentSubmit}>
            <div className="mb-4">
              <label 
                htmlFor="content" 
                className="block mb-2 font-semibold text-gray-800 dark:text-gray-200"
              >
                Your comment:
              </label>
              <textarea
                id="content"
                name="content"
                rows="4"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-y min-h-36 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                required
              ></textarea>
            </div>
            <button 
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all hover:-translate-y-1 hover:shadow-md active:translate-y-0 active:shadow-none"
            >
              Submit Comment
            </button>
          </form>
        </section>
      )}

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
      />
    </div>
    </>
  );
};

export default BlogDetailPage;
