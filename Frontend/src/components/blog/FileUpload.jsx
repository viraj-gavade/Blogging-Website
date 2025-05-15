import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

const FileUpload = ({ label, id, name, accept, onChange, file, supportedFormats, required }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      onChange(droppedFile);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="form-group flex flex-col">
      <label 
        htmlFor={id} 
        className="font-semibold text-sm mb-2 text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative flex flex-col gap-2">
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 bg-gray-50/80 hover:border-blue-500 hover:bg-blue-50/50'
          }`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mb-1"><strong>Choose a file</strong> or drag it here</p>
          <p className="text-sm text-gray-500">{supportedFormats}</p>
          
          <input 
            ref={fileInputRef}
            type="file"
            id={id}
            name={name}
            accept={accept}
            onChange={handleFileChange}
            required={required}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        
        {file && (
          <div className="text-sm text-gray-800 pl-2 py-1">
            Selected file: <span className="font-medium">{file.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

FileUpload.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  file: PropTypes.object,
  supportedFormats: PropTypes.string,
  required: PropTypes.bool
};

FileUpload.defaultProps = {
  accept: 'image/*',
  supportedFormats: 'Supported formats: JPG, PNG, GIF',
  required: false
};

export default FileUpload;
