import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

const ExpensesChart: React.FC = () => {
  const { transactions, categories, user } = useFinance();
  
  // Calculate expenses by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const existingCategory = acc.find(item => item.name === transaction.category);
      if (existingCategory) {
        existingCategory.value += transaction.amount;
      } else {
        const category = categories.find(c => c.name === transaction.category);
        acc.push({
          name: transaction.category,
          value: transaction.amount,
          color: category?.color || '#94a3b8'
        });
      }
      return acc;
    }, [] as { name: string; value: number; color: string }[])
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 categories

  // Calculate total expenses
  const totalExpenses = expensesByCategory.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-white">{data.name}</p>
          <p className="text-gray-600 dark:text-gray-300">
            {formatCurrency(data.value, user.currency)} ({((data.value / totalExpenses) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 animate-slide-up">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Top Expense Categories</h2>
      
      {totalExpenses === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No expense data to display</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {expensesByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ExpensesChart;