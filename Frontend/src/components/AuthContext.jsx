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
          console.log("Auth: User logged in from local storage");
        }
        
        // Then verify with the server
        console.log("Auth: Checking with server...");
        const response = await fetch('/api/v1/user/check-auth', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache, no-store',
            'Pragma': 'no-cache'
          }
        });
        
        console.log("Auth: Server responded with status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Auth: Server data:", data);
          
          if (data.isAuthenticated) {
            setIsLoggedIn(true);
            setUser(data.user);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log("Auth: Authenticated by server");
          } else {
            // Only clear if server explicitly says not authenticated
            console.log("Auth: Server says not authenticated");
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
          }
        } else {
          console.log("Auth: Server response not OK");
          // Keep using the localStorage value if server check fails
          // This prevents logout on server issues
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Don't clear local state on network errors
        // This prevents logout on network issues
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
        console.log("Auth: Check completed, isLoggedIn =", isLoggedIn);
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
      // Clear state first to ensure UI updates immediately
      setIsLoggedIn(false);
      setUser(null);
      
      // Clear localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      
      // Call the signout endpoint
      console.log("Logging out...");
      const response = await fetch('/api/v1/user/signout', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        console.log('Logout API call successful');
      } else {
        console.warn('Logout API call failed, but local state cleared');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // State already cleared above
    }
  };

  // This component acts as a fallback in case the AuthContext gets stuck
  if (isLoading && Date.now() - window.performance.timeOrigin > 5000) {
    // If loading for more than 5 seconds, show a recovery option
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Loading taking too long...</h2>
          <p className="mb-4">Authentication check seems to be stuck. You can try:</p>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('user');
                window.location.href = '/user/signin';
              }}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reset & Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

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
