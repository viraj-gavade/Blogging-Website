import React from 'react';
import Navbar from '../components/Navbar';
import BlogForm from '../components/blog/BlogForm';

const CreateBlogPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4">
        <BlogForm />
      </main>
    </div>
  );
};

export default CreateBlogPage;
