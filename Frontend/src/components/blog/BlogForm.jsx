import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate preview URL when image changes
  useEffect(() => {
    if (formData.coverImage && formData.coverImage instanceof File) {
      const url = URL.createObjectURL(formData.coverImage);
      setPreviewUrl(url);
      
      // Clean up the URL when component unmounts or image changes
      return () => URL.revokeObjectURL(url);
    }
  }, [formData.coverImage]);

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

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      coverImage: null
    });
    setPreviewUrl('');
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

          <div className="space-y-4">
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
            
            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-4 relative">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Image Preview</h3>
                <div className="relative rounded-lg overflow-hidden border border-gray-300">
                  <img 
                    src={previewUrl} 
                    alt="Cover preview" 
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 ease-in-out mt-4 transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;
