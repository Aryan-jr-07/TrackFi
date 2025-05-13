import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen flex overflow-hidden`}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6 transition-all animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;