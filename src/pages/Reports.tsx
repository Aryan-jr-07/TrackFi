import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

const Reports: React.FC = () => {
  const { transactions, categories, user } = useFinance();
  const [timeFrame, setTimeFrame] = useState<'month' | 'year'>('month');
  const [chartType, setChartType] = useState<'category' | 'time' | 'income'>('time');

  // Generate data for Category Distribution chart (Pie Chart)
  const getCategoryData = () => {
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });
    
    return Object.entries(expensesByCategory)
      .map(([name, value]) => {
        const categoryObj = categories.find((c) => c.name === name);
        return {
          name,
          value,
          color: categoryObj?.color || '#94a3b8',
        };
      })
      .sort((a, b) => b.value - a.value);
  };

  // Generate data for Time Series chart (Line/Bar Chart)
  const getTimeSeriesData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthLabels = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    let dataMap: Record<string, { name: string; income: number; expense: number }> = {};
    
    if (timeFrame === 'month') {
      // Last 30 days, grouped by day
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.getDate();
        const month = date.getMonth();
        const dateStr = `${month + 1}/${day}`;
        dataMap[dateStr] = { name: dateStr, income: 0, expense: 0 };
      }
      
      transactions.forEach((t) => {
        const transactionDate = new Date(t.date);
        const day = transactionDate.getDate();
        const month = transactionDate.getMonth();
        const dateStr = `${month + 1}/${day}`;
        
        // Only include transactions from the last 30 days
        const daysDiff = (now.getTime() - transactionDate.getTime()) / (1000 * 3600 * 24);
        if (daysDiff <= 30 && dataMap[dateStr]) {
          if (t.type === 'income') {
            dataMap[dateStr].income += t.amount;
          } else {
            dataMap[dateStr].expense += t.amount;
          }
        }
      });
    } else {
      // Last 12 months, grouped by month
      for (let i = 0; i < 12; i++) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const yearOffset = monthIndex > currentMonth ? -1 : 0;
        const year = currentYear + yearOffset;
        const monthStr = `${monthLabels[monthIndex]} ${year}`;
        dataMap[monthStr] = { name: monthStr, income: 0, expense: 0 };
      }
      
      transactions.forEach((t) => {
        const transactionDate = new Date(t.date);
        const month = transactionDate.getMonth();
        const year = transactionDate.getFullYear();
        const monthStr = `${monthLabels[month]} ${year}`;
        
        // Only include transactions from the last 12 months
        const monthsDiff = 
          (now.getFullYear() - transactionDate.getFullYear()) * 12 + 
          (now.getMonth() - transactionDate.getMonth());
        
        if (monthsDiff < 12 && dataMap[monthStr]) {
          if (t.type === 'income') {
            dataMap[monthStr].income += t.amount;
          } else {
            dataMap[monthStr].expense += t.amount;
          }
        }
      });
    }
    
    // Convert to array and sort by date
    return Object.values(dataMap).reverse();
  };

  // Generate data for Income vs Expense chart (Bar Chart)
  const getIncomeVsExpenseData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthLabels = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const dataMap: Record<string, { name: string; income: number; expense: number; savings: number }> = {};
    
    // Initialize with last 6 months or 6 years
    if (timeFrame === 'month') {
      for (let i = 0; i < 6; i++) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const yearOffset = monthIndex > currentMonth ? -1 : 0;
        const year = currentYear + yearOffset;
        const monthStr = `${monthLabels[monthIndex]} ${year}`;
        dataMap[monthStr] = { name: monthStr, income: 0, expense: 0, savings: 0 };
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const year = currentYear - i;
        dataMap[year.toString()] = { name: year.toString(), income: 0, expense: 0, savings: 0 };
      }
    }
    
    transactions.forEach((t) => {
      const transactionDate = new Date(t.date);
      const month = transactionDate.getMonth();
      const year = transactionDate.getFullYear();
      
      if (timeFrame === 'month') {
        const monthStr = `${monthLabels[month]} ${year}`;
        
        // Only include transactions from the last 6 months
        const monthsDiff = 
          (now.getFullYear() - transactionDate.getFullYear()) * 12 + 
          (now.getMonth() - transactionDate.getMonth());
        
        if (monthsDiff < 6 && dataMap[monthStr]) {
          if (t.type === 'income') {
            dataMap[monthStr].income += t.amount;
          } else {
            dataMap[monthStr].expense += t.amount;
          }
        }
      } else {
        const yearStr = year.toString();
        
        // Only include transactions from the last 6 years
        if (year > currentYear - 6 && dataMap[yearStr]) {
          if (t.type === 'income') {
            dataMap[yearStr].income += t.amount;
          } else {
            dataMap[yearStr].expense += t.amount;
          }
        }
      }
    });
    
    // Calculate savings
    Object.values(dataMap).forEach((data) => {
      data.savings = data.income - data.expense;
    });
    
    // Convert to array and sort by date
    return Object.values(dataMap).reverse();
  };

  const categoryData = getCategoryData();
  const timeSeriesData = getTimeSeriesData();
  const incomeVsExpenseData = getIncomeVsExpenseData();

  // Custom tooltip for category distribution
  const CategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-white">{payload[0].name}</p>
          <p className="text-gray-600 dark:text-gray-300">
            {formatCurrency(payload[0].value, user.currency)}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            {((payload[0].value / categoryData.reduce((sum, { value }) => sum + value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for time series
  const TimeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm text-success-600 dark:text-success-400">
              Income: {formatCurrency(payload[0].value, user.currency)}
            </p>
            <p className="text-sm text-danger-600 dark:text-danger-400">
              Expense: {formatCurrency(payload[1].value, user.currency)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for income vs expenses
  const IncomeTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
          <div className="space-y-1 mt-2">
            <p className="text-sm text-success-600 dark:text-success-400">
              Income: {formatCurrency(payload[0].value, user.currency)}
            </p>
            <p className="text-sm text-danger-600 dark:text-danger-400">
              Expense: {formatCurrency(payload[1].value, user.currency)}
            </p>
            <p className="text-sm text-primary-600 dark:text-primary-400">
              Savings: {formatCurrency(payload[2].value, user.currency)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visualize your financial data and track trends
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'category' | 'time' | 'income')}
              className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
            >
              <option value="time">Cash Flow Over Time</option>
              <option value="category">Expense Categories</option>
              <option value="income">Income vs Expenses</option>
            </select>
          </div>
          
          <div>
            <select
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as 'month' | 'year')}
              className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
            >
              <option value="month">Monthly View</option>
              <option value="year">Yearly View</option>
            </select>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 animate-slide-up">
        <div className="h-[400px]">
          {transactions.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-2">No transaction data to display</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Add transactions to see reports</p>
              </div>
            </div>
          ) : chartType === 'category' ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CategoryTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : chartType === 'time' ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeSeriesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<TimeTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incomeVsExpenseData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<IncomeTooltip />} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#22c55e" />
                <Bar dataKey="expense" name="Expenses" fill="#ef4444" />
                <Bar dataKey="savings" name="Savings" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;