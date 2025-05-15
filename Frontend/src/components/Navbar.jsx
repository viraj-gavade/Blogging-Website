import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    await logout();
    // Refresh the page to ensure clean state
    window.location.href = '/user/signin';
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <nav className="flex items-center justify-between bg-gray-900 text-white px-4 sm:px-6 md:px-8 py-3 shadow-md min-h-[60px]">
      <Link to="/" className="flex items-center text-xl font-bold text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
        </svg>
        Blogify
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/" className="text-gray-200 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800/30 transition-colors">Home</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/blog/create" className="text-gray-200 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800/30 transition-colors">Create Blog</Link>
            <button onClick={handleSignOut} className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-4 py-2 rounded-md font-medium transition-colors">Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/user/signup" className="text-gray-200 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800/30 transition-colors">Create Account</Link>
            <Link to="/user/signin" className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-4 py-2 rounded-md font-medium transition-colors">Sign In</Link>
          </>
        )}
      </div>
      
      {/* Mobile menu button */}
      <button 
        className="md:hidden text-black focus:outline-none"
        onClick={(e) => {
          e.stopPropagation();
          toggleMobileMenu();
        }}
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="absolute top-[60px] left-0 right-0 bg-gray-900 py-4 px-4 md:hidden z-50">
          <Link to="/" className="block text-gray-200 hover:text-white py-2 hover:bg-gray-800/30 px-3 rounded-md transition-colors">Home</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/blog/create" className="block text-gray-200 hover:text-white py-2 hover:bg-gray-800/30 px-3 rounded-md transition-colors">Create Blog</Link>
              <button onClick={handleSignOut} className="w-full text-left block bg-[#0066ff] hover:bg-[#0052cc] text-white px-3 py-2 mt-2 rounded-md font-medium transition-colors">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/user/signup" className="block text-gray-200 hover:text-white py-2 hover:bg-gray-800/30 px-3 rounded-md transition-colors">Create Account</Link>
              <Link to="/user/signin" className="block bg-[#0066ff] hover:bg-[#0052cc] text-white px-3 py-2 mt-2 rounded-md font-medium transition-colors">Sign In</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
