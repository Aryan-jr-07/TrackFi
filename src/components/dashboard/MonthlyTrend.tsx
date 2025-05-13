import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

const MonthlyTrend: React.FC = () => {
  const { transactions, user } = useFinance();

  // Group transactions by month
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const key = `${month} ${year}`;

    if (!acc[key]) {
      acc[key] = { month: key, income: 0, expense: 0, savings: 0 };
    }

    if (transaction.type === 'income') {
      acc[key].income += transaction.amount;
    } else {
      acc[key].expense += transaction.amount;
    }
    acc[key].savings = acc[key].income - acc[key].expense;

    return acc;
  }, {} as Record<string, { month: string; income: number; expense: number; savings: number }>);

  // Convert to array and sort by date
  const chartData = Object.values(monthlyData).sort((a, b) => {
    const [monthA, yearA] = a.month.split(' ');
    const [monthB, yearB] = b.month.split(' ');
    return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime();
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 animate-slide-up">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Monthly Trends</h2>
      
      {chartData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No data to display</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.2}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.2}
                activeDot={{ r: 6 }}
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.2}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MonthlyTrend;