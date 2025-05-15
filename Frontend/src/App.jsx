import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';
import BlogList from './components/BlogList';
import BlogDetailPage from './pages/BlogDetailPage';
import CreateBlogPage from './pages/CreateBlogPage';
import SignupPage from './pages/SignupPage';
import SigninPage from './pages/SigninPage';

function App() {
  return (
    <AuthProvider>
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
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/blog/create" element={<CreateBlogPage />} />
            <Route path="/user/signup" element={<SignupPage />} />
            <Route path="/user/signin" element={<SigninPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
