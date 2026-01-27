import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-5 h-5">
        <Sun
          className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${
            isDarkMode
              ? 'rotate-0 opacity-100 scale-100'
              : 'rotate-90 opacity-0 scale-0'
          }`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 text-gray-700 dark:text-gray-300 transition-all duration-300 ${
            !isDarkMode
              ? 'rotate-0 opacity-100 scale-100'
              : '-rotate-90 opacity-0 scale-0'
          }`}
        />
      </div>
      <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs font-medium bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {isDarkMode ? 'Light mode' : 'Dark mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;