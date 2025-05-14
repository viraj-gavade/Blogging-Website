import React from 'react';
import Navbar from './components/Navbar';
import BlogCard from './components/BlogCard';
import ToastContainer from './components/Toast';

function App() {
  // Later this can be replaced with actual authentication state
  const isLoggedIn = false;

  return (
    <div className="min-h-screen bg-white">
      <Navbar isLoggedIn={isLoggedIn} />
      
      <main>
        <section className="py-8 bg-blue-50">
          <div className="container-custom">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Insightful Articles</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Explore our collection of thoughtful, informative, and engaging blog posts on various topics.
            </p>
          </div>
        </section>

        <BlogCard />
      </main>

      <ToastContainer />
    </div>
  );
}

export default App;
