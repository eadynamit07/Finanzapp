import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? <Sun size={20} className="animate-in fade-in zoom-in duration-300" /> : <Moon size={20} className="animate-in fade-in zoom-in duration-300" />}
    </button>
  );
};

export default ThemeToggle;
