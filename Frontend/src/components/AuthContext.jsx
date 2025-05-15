import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // Load stored user data on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user data", e);
      }
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in on initial load
    const checkLoginStatus = async () => {
      try {
        // First, check localStorage for a quick response
        const storedStatus = localStorage.getItem('isLoggedIn') === 'true';
        if (storedStatus) {
          setIsLoggedIn(true);
        }
        
        // Then verify with the server
        const response = await fetch('/api/v1/user/check-auth', {
          credentials: 'include', // Important for cookies
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.isAuthenticated) {
            setIsLoggedIn(true);
            setUser(data.user);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            // Only clear if server explicitly says not authenticated
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Don't clear local state on network errors
        // This prevents logout on network issues
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };
    
    checkLoginStatus();
  }, []);

  const login = (userData) => {
    // Update state
    setIsLoggedIn(true);
    setUser(userData);
    
    // Update localStorage
    localStorage.setItem('isLoggedIn', 'true');
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    console.log('User logged in successfully:', userData?.fullName || 'Unknown User');
  };

  const logout = async () => {
    try {
      // Call the signout endpoint
      const response = await fetch('/api/v1/user/signout', {
        method: 'GET',
        credentials: 'include'
      });
      
      // Clear state first to ensure UI updates immediately
      setIsLoggedIn(false);
      setUser(null);
      
      // Then clear localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      
      if (response.ok) {
        console.log('Logout successful');
      }
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if request fails, clear local state anyway
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      isLoading,
      authChecked,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
