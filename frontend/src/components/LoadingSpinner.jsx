import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 rounded-full`}></div>
        <div className={`${sizeClasses[size]} border-4 border-primary-500 dark:border-primary-400 border-t-transparent rounded-full absolute top-0 left-0 animate-spin`}></div>
      </div>
      {text && (
        <p className="text-gray-600 dark:text-gray-400 font-medium">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;