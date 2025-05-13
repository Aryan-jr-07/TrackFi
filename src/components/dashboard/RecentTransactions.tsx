import React from 'react';
import { Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

const RecentTransactions: React.FC = () => {
  const { transactions, user } = useFinance();

  // Get last 5 transactions sorted by date (newest first)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Transactions</h2>
        <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
      </div>

      {recentTransactions.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center">
                <div
                  className={`p-2 rounded-full mr-3 ${
                    transaction.type === 'income'
                      ? 'bg-success-100 dark:bg-success-900/30 text-success-600'
                      : 'bg-danger-100 dark:bg-danger-900/30 text-danger-600'
                  }`}
                >
                  {transaction.type === 'income' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {transaction.category} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <p
                className={`font-semibold ${
                  transaction.type === 'income'
                    ? 'text-success-600 dark:text-success-400'
                    : 'text-danger-600 dark:text-danger-400'
                }`}
              >
                {transaction.type === 'income' ? '+' : '-'}{' '}
                {formatCurrency(transaction.amount, user.currency)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;