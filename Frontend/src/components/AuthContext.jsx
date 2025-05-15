import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkLoginStatus = async () => {
      try {
        // First, check localStorage for a quick response
        const storedStatus = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(storedStatus);
        
        // Then verify with the server (in a real app)
        // const response = await fetch('/api/v1/user/check-auth', {
        //   credentials: 'include' // Important for cookies
        // });
        // 
        // if (response.ok) {
        //   const userData = await response.json();
        //   setIsLoggedIn(true);
        //   setUser(userData.user);
        //   localStorage.setItem('isLoggedIn', 'true');
        // } else {
        //   setIsLoggedIn(false);
        //   setUser(null);
        //   localStorage.removeItem('isLoggedIn');
        // }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkLoginStatus();
  }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = async () => {
    try {
      // Call the signout endpoint
      await fetch('/api/v1/user/signout', {
        method: 'GET',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of server response
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('isLoggedIn');
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
