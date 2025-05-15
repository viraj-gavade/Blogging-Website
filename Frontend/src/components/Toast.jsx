import React, { useEffect, useState } from 'react';

const Toast = ({ type, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Wait for exit animation before calling onClose
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 300); // 300ms for the animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  // Determine toast appearance based on type
  let headerClass, icon;
  switch (type) {
    case 'error':
      headerClass = 'bg-red-600';
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
      );
      break;
    case 'success':
      headerClass = 'bg-green-600';
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
      break;
    case 'info':
    default:
      headerClass = 'bg-blue-600';
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      );
  }

  return (
    <div
      className={`fixed bottom-4 right-4 min-w-[280px] max-w-sm rounded-lg shadow-lg transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      }`}
    >
      <div className={`flex items-center justify-between ${headerClass} text-white px-4 py-2 rounded-t-lg`}>
        <div className="flex items-center">
          {icon}
          <strong className="ml-2 font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</strong>
        </div>
        <div className="flex items-center">
          <span className="text-xs opacity-75 mr-2">just now</span>
          <button
            onClick={() => {
              setIsExiting(true);
              setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
              }, 300);
            }}
            className="focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <div className={`bg-white px-4 py-3 rounded-b-lg border-l-4 ${
        type === 'error' ? 'border-red-600' : 
        type === 'success' ? 'border-green-600' : 'border-blue-600'
      }`}>
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
};

const ToastContainer = () => {
  // Example toast state - this would normally come from a context or state management
  const [toasts, setToasts] = useState([
    { id: 1, type: 'success', message: 'Your blog post was successfully created!' }
  ]);

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
export { Toast };
