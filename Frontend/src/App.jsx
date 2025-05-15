import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import BlogList from './components/BlogList';
import Navbar from './components/Navbar';
import BlogDetailPage from './pages/BlogDetailPage';
import CreateBlogPage from './pages/CreateBlogPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';
import ErrorBoundary from './components/ErrorBoundary';
// Import ToastContainer at the app level
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Wrap routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/user/signin" />;
  }
  
  return children;
};

// Main app without AuthProvider to use useAuth hook
function AppContent() {
  const { isLoggedIn, isLoading, login } = useAuth();
  
  // Handle returning from Google OAuth
  useEffect(() => {
    const isGoogleAuthInProgress = localStorage.getItem('googleAuthInProgress') === 'true';
    
    if (isGoogleAuthInProgress) {
      // Clear the flag
      localStorage.removeItem('googleAuthInProgress');
      
      // Check if we're now logged in
      const checkAuthAfterGoogleLogin = async () => {
        try {
          const response = await fetch('/auth/check', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.authenticated) {
              // Update auth context
              login({
                id: data.user._id,
                fullName: data.user.name,
                email: data.user.email
              });
              
              // Show success toast
              toast.success('Successfully signed in with Google');
            }
          }
        } catch (error) {
          console.error('Error checking auth after Google login', error);
        }
      };
      
      checkAuthAfterGoogleLogin();
    }
  }, [login]);
  
  // Show a loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <main>
                <section className="py-8 bg-blue-50">
                  <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Insightful Articles</h1>
                    <p className="text-xl text-gray-600 max-w-2xl">
                      Explore our collection of thoughtful, informative, and engaging blog posts on various topics.
                    </p>
                  </div>
                </section>
                <BlogList />
              </main>
            </>
          } />
          <Route path="/api/v1/blog/:id" element={
            <>
              <Navbar />
              <BlogDetailPage />
            </>
          } />
          <Route path="/blog/create" element={
            <ProtectedRoute>
              <Navbar />
              <CreateBlogPage />
            </ProtectedRoute>
          } />
          <Route path="/user/signup" element={
            isLoggedIn ? <Navigate to="/" /> : (
              <>
                <Navbar />
                <SignupPage />
              </>
            )
          } />
          <Route path="/user/signin" element={
            isLoggedIn ? <Navigate to="/" /> : (
              <>
                <Navbar />
                <SigninPage />
              </>
            )
          } />
        </Routes>
        {/* Add a single ToastContainer at the app level */}
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
    </Router>
  );
}

// Error boundary component
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
