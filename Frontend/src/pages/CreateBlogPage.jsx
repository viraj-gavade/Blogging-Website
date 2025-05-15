import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import BlogForm from '../components/blog/BlogForm';

const CreateBlogPage = () => {
  return (
    <>
      <main className="container mx-auto px-4">
        <BlogForm />
      </main>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default CreateBlogPage;
