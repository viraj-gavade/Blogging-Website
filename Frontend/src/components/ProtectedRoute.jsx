import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You could render a loading spinner here
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isLoggedIn) {
    // Redirect to login page while preserving the intended destination
    return <Navigate to="/user/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
