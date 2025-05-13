import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Landmark, TrendingUp } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

const FinanceSummary: React.FC = () => {
  const { getFinanceSummary, user } = useFinance();
  const summary = getFinanceSummary();

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(summary.totalIncome, user.currency),
      icon: <ArrowUpCircle className="text-success-500" size={24} />,
      bgColor: 'bg-success-50 dark:bg-success-900/20',
      textColor: 'text-success-700 dark:text-success-400',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses, user.currency),
      icon: <ArrowDownCircle className="text-danger-500" size={24} />,
      bgColor: 'bg-danger-50 dark:bg-danger-900/20',
      textColor: 'text-danger-700 dark:text-danger-400',
    },
    {
      title: 'Net Savings',
      value: formatCurrency(summary.netSavings, user.currency),
      icon: <Landmark className="text-primary-500" size={24} />,
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
      textColor: 'text-primary-700 dark:text-primary-400',
    },
    {
      title: 'Savings Rate',
      value: `${summary.savingsRate.toFixed(1)}%`,
      icon: <TrendingUp className="text-purple-500" size={24} />,
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      {cards.map((card, index) => (
        <div 
          key={index}
          className={`${card.bgColor} p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                {card.title}
              </p>
              <h3 className={`text-xl font-bold ${card.textColor}`}>{card.value}</h3>
            </div>
            <div className="p-2 rounded-full">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinanceSummary;