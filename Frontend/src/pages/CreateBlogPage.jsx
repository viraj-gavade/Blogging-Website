import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import BlogForm from '../components/blog/BlogForm';

const CreateBlogPage = () => {
  return (
    <>
      <Navbar />
        <BlogForm />
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default CreateBlogPage;
