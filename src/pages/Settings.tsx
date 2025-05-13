import React, { useState } from 'react';
import { 
  PaintBucket, 
  Moon, 
  Sun, 
  Monitor, 
  CreditCard, 
  User, 
  LogOut 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFinance } from '../context/FinanceContext';
import { ThemeMode, ColorScheme } from '../types';

const Settings: React.FC = () => {
  const { themeMode, colorScheme, setThemeMode, setColorScheme } = useTheme();
  const { user, updateUser, exportToCSV } = useFinance();
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currency: user.currency,
  });

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    setColorScheme(scheme);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
  };

  const handleExport = () => {
    exportToCSV();
  };

  const colorSchemes = [
    { name: 'Blue', value: 'blue', color: '#0ea5e9' },
    { name: 'Green', value: 'green', color: '#22c55e' },
    { name: 'Purple', value: 'purple', color: '#a855f7' },
    { name: 'Teal', value: 'teal', color: '#14b8a6' },
    { name: 'Orange', value: 'orange', color: '#f97316' },
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account preferences and app settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center mb-4">
            <PaintBucket className="text-primary-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Theme Mode
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${
                    themeMode === 'light'
                      ? 'bg-primary-50 text-primary-600 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Sun size={16} className="mr-2" />
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${
                    themeMode === 'dark'
                      ? 'bg-primary-50 text-primary-600 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Moon size={16} className="mr-2" />
                  Dark
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center ${
                    themeMode === 'system'
                      ? 'bg-primary-50 text-primary-600 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-800'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Monitor size={16} className="mr-2" />
                  System
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Color Theme
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.value}
                    onClick={() => handleColorSchemeChange(scheme.value as ColorScheme)}
                    className={`w-full aspect-square rounded-full border-2 ${
                      colorScheme === scheme.value
                        ? 'border-gray-800 dark:border-white'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: scheme.color }}
                    title={scheme.name}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
          <div className="flex items-center mb-4">
            <User className="text-primary-500 mr-2" size={20} />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="name" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
              />
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
              />
            </div>

            <div>
              <label 
                htmlFor="currency" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"
              >
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name} ({currency.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <div className="flex items-center mb-4">
          <CreditCard className="text-primary-500 mr-2" size={20} />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Data & Privacy</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white">Export Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download all your transaction data as CSV
              </p>
            </div>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
            >
              Export
            </button>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-4">
            <button
              className="flex items-center text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300"
            >
              <LogOut size={16} className="mr-2" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;