import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Target,
  BarChart3,
  Settings as SettingsIcon,
  ChevronLeft,
  Menu,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { isDarkMode, colorScheme } = useTheme();

  const primaryColor = {
    blue: 'primary-600',
    green: 'success-600',
    purple: 'purple-600',
    teal: 'teal-600',
    orange: 'warning-600',
  }[colorScheme];

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/transactions', label: 'Transactions', icon: <Receipt size={20} /> },
    { path: '/budgets', label: 'Budgets', icon: <PiggyBank size={20} /> },
    { path: '/goals', label: 'Goals', icon: <Target size={20} /> },
    { path: '/reports', label: 'Reports', icon: <BarChart3 size={20} /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon size={20} /> },
  ];

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-10"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-10 h-full 
          ${isCollapsed ? '-translate-x-full' : 'translate-x-0'} 
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          w-64 flex-shrink-0 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <PiggyBank
                  size={28}
                  className={`text-${primaryColor} mr-2`}
                />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">FinTrack</h1>
              </div>
              <button
                onClick={() => setIsCollapsed(true)}
                className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 pt-4 pb-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 rounded-lg transition-colors duration-150
                      ${isActive
                        ? `bg-${primaryColor} bg-opacity-10 text-${primaryColor}`
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        setIsCollapsed(true);
                      }
                    }}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>FinTrack v0.1.0</p>
              <p className="mt-1">© 2025 All Rights Reserved</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;