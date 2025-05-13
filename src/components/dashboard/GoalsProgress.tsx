import React from 'react';
import { Target } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/formatters';

const GoalsProgress: React.FC = () => {
  const { goals, user } = useFinance();

  // Sort goals by progress percentage (highest first)
  const sortedGoals = [...goals].sort(
    (a, b) => b.currentAmount / b.targetAmount - a.currentAmount / a.targetAmount
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Savings Goals</h2>
        <Target size={18} className="text-gray-500 dark:text-gray-400" />
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">No savings goals yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedGoals.slice(0, 3).map((goal) => {
            const progressPercent = (goal.currentAmount / goal.targetAmount) * 100;
            const priorityColor = {
              low: 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
              medium: 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400',
              high: 'bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400',
            }[goal.priority];

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-800 dark:text-white">{goal.name}</h3>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${priorityColor}`}
                    >
                      {goal.priority}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {formatCurrency(goal.currentAmount, user.currency)} of{' '}
                      {formatCurrency(goal.targetAmount, user.currency)}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-primary-500"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GoalsProgress;