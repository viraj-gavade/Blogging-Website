import React, { useState, useEffect } from 'react';

const Navbar = ({ isLoggedIn = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isMobileMenuOpen && !event.target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMobileMenuOpen]);

  return (
    <nav className="flex items-center justify-between bg-[#111827] text-white px-4 sm:px-6 md:px-8 py-3 shadow-md min-h-[60px]">
      <a href="/" className="flex items-center text-xl font-bold text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
        </svg>
        Blogify
      </a>
      
      {/* Desktop Navigation - Always visible on desktop */}
      <div className="hidden md:flex items-center gap-4">
        <a href="/" className="text-gray-200 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800/30 transition">Home</a>
        
        {isLoggedIn ? (
          <>
            <a href="/blog/create" className="text-gray-200 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800/30 transition">Create Blog</a>
            <a href="/user/signout" className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-4 py-2 rounded-md font-medium transition">Sign Out</a>
          </>
        ) : (
          <>
            <a href="/user/signup" className="text-gray-200 hover:text-white px-3 py-2 rounded-md hover:bg-gray-800/30 transition">Create Account</a>
            <a href="/user/signin" className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-4 py-2 rounded-md font-medium transition">Sign In</a>
          </>
        )}
      </div>
      
      {/* Mobile menu button - Only visible on mobile */}
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
      
      {/* Mobile Navigation - Fixed position absolute to avoid layout issues */}
      <div 
        className={`absolute top-[60px] left-0 right-0 bg-[#111827] py-4 px-4 md:hidden z-50 transform transition-all duration-300 ${
          isMobileMenuOpen ? 'block' : 'hidden'
        }`}
      >
        <a href="/" className="block text-gray-200 hover:text-white py-2 hover:bg-gray-800/30 px-3 rounded-md transition">Home</a>
        
        {isLoggedIn ? (
          <>
            <a href="/blog/create" className="block text-gray-200 hover:text-white py-2 hover:bg-gray-800/30 px-3 rounded-md transition">Create Blog</a>
            <a href="/user/signout" className="block bg-[#0066ff] hover:bg-[#0052cc] text-white px-3 py-2 mt-2 rounded-md font-medium text-center transition">Sign Out</a>
          </>
        ) : (
          <>
            <a href="/user/signup" className="block text-gray-200 hover:text-white py-2 hover:bg-gray-800/30 px-3 rounded-md transition">Create Account</a>
            <a href="/user/signin" className="block bg-[#0066ff] hover:bg-[#0052cc] text-white px-3 py-2 mt-2 rounded-md font-medium text-center transition">Sign In</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
