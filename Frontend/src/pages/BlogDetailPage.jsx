import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [currentUser, setCurrentUser] = useState({ id: 'current-user', fullName: 'Current User' });

  useEffect(() => {
    // Simulate fetching blog data
    const fetchedBlog = {
      id,
      title: 'Understanding the Modern JavaScript Ecosystem',
      createdAt: new Date().toLocaleDateString(),
      AddedBy: { fullName: 'John Doe' },
      CoverImageURL: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      body: 'JavaScript has evolved significantly over the years, becoming one of the most versatile and widely-used programming languages. From simple client-side scripting to powering complex web applications and even server-side development through Node.js, JavaScript has come a long way.\n\nIn this article, we\'ll explore the modern JavaScript ecosystem, including frameworks like React, Vue, and Angular, build tools like Webpack and Babel, and package managers like npm and yarn. We\'ll also discuss best practices for structuring your JavaScript projects and keeping up with the ever-changing landscape.'
    };

    const fetchedComments = [
      {
        id: '1',
        content: 'Great article! This really helped me understand the JavaScript ecosystem better.',
        CommentBy: { id: 'user1', fullName: 'Alice Johnson' },
        createdAt: new Date(Date.now() - 86400000).toLocaleDateString() // 1 day ago
      },
      {
        id: '2',
        content: 'I would love to see a follow-up article about TypeScript integration with these tools.',
        CommentBy: { id: 'user2', fullName: 'Bob Smith' },
        createdAt: new Date(Date.now() - 43200000).toLocaleDateString() // 12 hours ago
      },
      {
        id: '3',
        content: 'This is my comment that I should be able to delete.',
        CommentBy: { id: 'current-user', fullName: 'Current User' },
        createdAt: new Date().toLocaleDateString() // current time
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setBlog(fetchedBlog);
      setComments(fetchedComments);
    }, 300);

    // Check URL for notification parameters
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'comment_added') {
      toast.success('Comment added successfully!');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // In a real app, you would check auth state here
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true' || true); // Set to true for demo purposes
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    // In a real app, this would be an API call
    const newComment = {
      id: Date.now().toString(),
      content: commentText,
      CommentBy: currentUser,
      createdAt: new Date().toLocaleDateString()
    };
    
    setComments([newComment, ...comments]);
    setCommentText('');
    toast.success('Comment added successfully!');
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      // In a real app, this would be an API call
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted successfully!');
    }
  };

  const isCommentOwner = (comment) => {
    return comment.CommentBy.id === currentUser.id;
  };

  if (!blog) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
  }

  return (
    <main className="w-11/12 max-w-3xl mx-auto my-8 md:my-16">
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
                    onClick={() => handleDeleteComment(comment.id)}
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
    </main>
  );
};

export default BlogDetailPage;
