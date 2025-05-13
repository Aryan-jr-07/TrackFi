import React from 'react';
import { useLocation } from 'react-router-dom';
import { Download, Sun, Moon, BellRing } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useFinance } from '../../context/FinanceContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { exportToCSV } = useFinance();

  // Get page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    return path.slice(1).charAt(0).toUpperCase() + path.slice(2);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm py-3 px-4 md:px-6 flex items-center justify-between transition-colors duration-200">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
        {getPageTitle()}
      </h1>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={exportToCSV}
          className="flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Export data to CSV"
        >
          <Download size={20} />
        </button>
        
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button
          className="flex items-center justify-center p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Notifications"
        >
          <BellRing size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;