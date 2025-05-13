import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Budget } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget, spent, onEdit, onDelete }) => {
  const { user } = useFinance();
  const progress = (spent / budget.amount) * 100;
  const remaining = Math.max(budget.amount - spent, 0);

  // Determine progress color
  let progressColor = 'bg-primary-500';
  if (progress > 85) {
    progressColor = 'bg-danger-500';
  } else if (progress > 65) {
    progressColor = 'bg-warning-500';
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{budget.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(budget)}
            className="p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="p-1 text-gray-500 hover:text-danger-600 dark:text-gray-400 dark:hover:text-danger-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-300">
            {formatCurrency(spent, user.currency)} of {formatCurrency(budget.amount, user.currency)}
          </span>
          <span className={progress > 100 ? 'text-danger-600 dark:text-danger-400' : 'text-gray-600 dark:text-gray-300'}>
            {Math.round(progress)}%
          </span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${progressColor}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600 dark:text-gray-300">
          {budget.period === 'monthly' ? 'Monthly' : 'Yearly'} budget
        </span>
        <span className="text-success-600 dark:text-success-400 font-medium">
          {formatCurrency(remaining, user.currency)} left
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;