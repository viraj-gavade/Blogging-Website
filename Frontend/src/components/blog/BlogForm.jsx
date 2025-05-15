import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import FormInput from './FormInput';
import FormTextarea from './FormTextarea';
import FileUpload from './FileUpload';

const BlogForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    coverImage: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (file) => {
    setFormData({
      ...formData,
      coverImage: file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      toast.error("Please enter a blog title");
      return;
    }
    
    if (!formData.body.trim()) {
      toast.error("Please enter blog content");
      return;
    }
    
    if (!formData.coverImage) {
      toast.error("Please upload a cover image");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create multipart form data
      const data = new FormData();
      data.append('title', formData.title);
      data.append('body', formData.body);
      data.append('CoverImageURL', formData.coverImage);

      // Submit to backend
      const response = await fetch('/api/v1/blog/addblog', {
        method: 'POST',
        body: data,
        credentials: 'include' // Important for cookies/auth
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to publish blog post');
      }

      toast.success("Blog post published successfully!");
      
      // Redirect after successful submission
      setTimeout(() => {
        navigate('/?action=blog_posted');
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || "Failed to publish blog post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 my-8 md:my-16 animate__animated animate__fadeIn">
      <div className="bg-white rounded-xl shadow-md p-6 md:p-10 transition-all duration-200">
        <h1 className="font-bold text-2xl md:text-3xl text-gray-800 mb-6 text-center">Create Blog Post</h1>
        
        <form 
          className="flex flex-col gap-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <FormInput
            label="Title"
            id="title"
            name="title"
            placeholder="Enter blog title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <FormTextarea
            label="Content"
            id="body"
            name="body"
            placeholder="Write your blog content here..."
            value={formData.body}
            onChange={handleChange}
            required
          />

          <FileUpload
            label="Cover Image"
            id="coverImage"
            name="CoverImageURL"
            accept="image/*"
            onChange={handleFileChange}
            file={formData.coverImage}
            supportedFormats="Supported formats: JPG, PNG, GIF"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 ease-in-out mt-4 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>
      
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default BlogForm;
