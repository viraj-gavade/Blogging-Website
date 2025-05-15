import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/user/signin');
  };

  return (
    <nav className="flex items-center justify-between bg-gray-900 text-white px-6 md:px-8 py-3 shadow-md">
      <Link to="/" className="flex items-center text-xl font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
        </svg>
        Blogify
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4 navbar-links">
        <Link to="/" className="text-gray-200 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800 transition">Home</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/blog/create" className="text-gray-200 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800 transition">Create Blog</Link>
            <Link to="#" onClick={handleSignOut} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition">Sign Out</Link>
          </>
        ) : (
          <>
            <Link to="/user/signup" className="text-gray-200 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800 transition">Create Account</Link>
            <Link to="/user/signin" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition">Sign In</Link>
          </>
        )}
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-white focus:outline-none"
        onClick={toggleMobileMenu}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-gray-900 py-2 px-4 md:hidden z-50">
          <Link to="/" className="block text-gray-200 hover:text-white py-2 hover:bg-gray-800 px-3 rounded-md transition">Home</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/blog/create" className="block text-gray-200 hover:text-white py-2 hover:bg-gray-800 px-3 rounded-md transition">Create Blog</Link>
              <Link to="#" onClick={handleSignOut} className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 mt-2 rounded-md font-medium text-center transition">Sign Out</Link>
            </>
          ) : (
            <>
              <Link to="/user/signup" className="block text-gray-200 hover:text-white py-2 hover:bg-gray-800 px-3 rounded-md transition">Create Account</Link>
              <Link to="/user/signin" className="block bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 mt-2 rounded-md font-medium text-center transition">Sign In</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
