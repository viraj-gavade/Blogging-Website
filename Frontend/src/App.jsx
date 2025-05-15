import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BlogList from './components/BlogList';
import BlogDetailPage from './pages/BlogDetailPage';
import CreateBlogPage from './pages/CreateBlogPage';

function App() {
  // Later this can be replaced with actual authentication state
  const isLoggedIn = true;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar isLoggedIn={isLoggedIn} />
        
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <section className="py-8 bg-blue-50 dark:bg-blue-900">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                      Discover Insightful Articles
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                      Explore our collection of thoughtful, informative, and engaging blog posts on various topics.
                    </p>
                  </div>
                </section>

                <BlogList />
              </>
            } />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/blog/create" element={<CreateBlogPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
