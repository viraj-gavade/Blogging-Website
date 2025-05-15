import React from 'react';
import PropTypes from 'prop-types';

const GoogleAuthButton = ({ text }) => {
  const handleGoogleAuth = () => {
    // For OAuth redirects, we need to use window.location.href instead of fetch
    // OAuth requires a full page navigation, not an AJAX request
    try {
      // Set a flag to indicate Google auth is in progress
      localStorage.setItem('googleAuthInProgress', 'true');
      
      // Redirect to the correct Google OAuth endpoint
      window.location.href = '/auth/google';
    } catch (error) {
      console.error('Error initiating Google auth:', error);
    }
  };
  
  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="w-full flex justify-center items-center gap-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24"
        className="w-5 h-5"
      >
        <path 
          fill="#4285F4" 
          d="M21.6 12.2c0-.7-.1-1.3-.2-1.9h-9.4v3.6h5.4c-.2 1.2-.9 2.2-2 2.9v2.4h3.3c1.9-1.7 3-4.3 3-7z"
        />
        <path 
          fill="#34A853" 
          d="M12 22c2.8 0 5.1-.9 6.8-2.4l-3.3-2.4c-.9.6-2.1 1-3.5 1-2.7 0-4.9-1.8-5.7-4.2H2.9v2.5C4.7 19.7 8.1 22 12 22z"
        />
        <path 
          fill="#FBBC05" 
          d="M6.3 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.6H2.9C2.3 9 2 10.4 2 12s.3 3 .9 4.4l3.4-2.5z"
        />
        <path 
          fill="#EA4335" 
          d="M12 5.8c1.5 0 2.9.5 3.9 1.5l2.9-2.9C17.1 2.7 14.8 2 12 2 8.1 2 4.7 4.3 2.9 7.6l3.4 2.5c.8-2.4 3-4.3 5.7-4.3z"
        />
      </svg>
      {text}
    </button>
  );
};

GoogleAuthButton.propTypes = {
  text: PropTypes.string.isRequired,
};

GoogleAuthButton.defaultProps = {
  text: 'Sign in with Google',
};

export default GoogleAuthButton;
