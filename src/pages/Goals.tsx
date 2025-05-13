import React, { useState } from 'react';
import { Plus, Target, ArrowRight, Calendar, Award } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import GoalForm from '../components/goals/GoalForm';
import Modal from '../components/ui/Modal';
import { Goal } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

const Goals: React.FC = () => {
  const { goals, user, updateGoal, deleteGoal } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | undefined>(undefined);

  const handleEdit = (goal: Goal) => {
    setEditGoal(goal);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
    }
  };

  const handleAddNew = () => {
    setEditGoal(undefined);
    setShowModal(true);
  };

  // Function to update goal amount (simulating a contribution)
  const handleContribute = (goal: Goal) => {
    const amount = prompt('Enter contribution amount:');
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      const newAmount = goal.currentAmount + Number(amount);
      updateGoal({
        ...goal,
        currentAmount: Math.min(newAmount, goal.targetAmount),
      });
    }
  };

  // Group goals by priority
  const groupedGoals = goals.reduce(
    (acc, goal) => {
      acc[goal.priority].push(goal);
      return acc;
    },
    { high: [] as Goal[], medium: [] as Goal[], low: [] as Goal[] }
  );

  // Sort goals by progress percentage (descending)
  const sortGoals = (goals: Goal[]) => {
    return [...goals].sort(
      (a, b) => b.currentAmount / b.targetAmount - a.currentAmount / a.targetAmount
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Savings Goals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your progress towards financial goals
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus size={16} className="mr-2" />
          New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have any savings goals yet. Create your first goal to start tracking your progress.
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus size={16} className="mr-2" />
            Create Goal
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* High Priority Goals */}
          {groupedGoals.high.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">High Priority</h2>
                <div className="ml-2 px-2 py-0.5 text-xs bg-danger-100 text-danger-700 dark:bg-danger-900/20 dark:text-danger-400 rounded-full">
                  {groupedGoals.high.length}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sortGoals(groupedGoals.high).map((goal) => renderGoalCard(goal))}
              </div>
            </div>
          )}

          {/* Medium Priority Goals */}
          {groupedGoals.medium.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Medium Priority</h2>
                <div className="ml-2 px-2 py-0.5 text-xs bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400 rounded-full">
                  {groupedGoals.medium.length}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sortGoals(groupedGoals.medium).map((goal) => renderGoalCard(goal))}
              </div>
            </div>
          )}

          {/* Low Priority Goals */}
          {groupedGoals.low.length > 0 && (
            <div>
              <div className="flex items-center mb-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Low Priority</h2>
                <div className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 rounded-full">
                  {groupedGoals.low.length}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sortGoals(groupedGoals.low).map((goal) => renderGoalCard(goal))}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <GoalForm onClose={() => setShowModal(false)} editGoal={editGoal} />
      </Modal>
    </div>
  );

  function renderGoalCard(goal: Goal) {
    const progressPercent = (goal.currentAmount / goal.targetAmount) * 100;
    const isCompleted = progressPercent >= 100;
    
    return (
      <div
        key={goal.id}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <Target className="text-primary-500 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{goal.name}</h3>
          </div>
          {goal.category && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">
              {goal.category}
            </span>
          )}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">
              {formatCurrency(goal.currentAmount, user.currency)} of{' '}
              {formatCurrency(goal.targetAmount, user.currency)}
            </span>
            <span className="font-medium">
              {isCompleted ? (
                <span className="text-success-600 dark:text-success-400">Completed!</span>
              ) : (
                `${Math.round(progressPercent)}%`
              )}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                isCompleted
                  ? 'bg-success-500'
                  : progressPercent > 75
                  ? 'bg-primary-500'
                  : progressPercent > 25
                  ? 'bg-warning-500'
                  : 'bg-danger-500'
              }`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar size={14} className="mr-1" />
            <span>
              {goal.deadline ? `Due: ${formatDate(goal.deadline)}` : 'No deadline'}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            {goal.deadline && !isCompleted ? (
              <div>
                {new Date(goal.deadline) < new Date() ? (
                  <span className="text-danger-600 dark:text-danger-400">Overdue</span>
                ) : (
                  <span>{daysBetween(new Date(), new Date(goal.deadline))} days left</span>
                )}
              </div>
            ) : isCompleted ? (
              <div className="flex items-center text-success-600 dark:text-success-400">
                <Award size={14} className="mr-1" />
                <span>Goal achieved</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex justify-between mt-4 space-x-2">
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(goal)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(goal.id)}
              className="px-3 py-1.5 text-xs font-medium text-danger-700 dark:text-danger-300 bg-danger-100 dark:bg-danger-900/20 rounded-md hover:bg-danger-200 dark:hover:bg-danger-800/30"
            >
              Delete
            </button>
          </div>
          {!isCompleted && (
            <button
              onClick={() => handleContribute(goal)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              Contribute
              <ArrowRight size={12} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    );
  }

  function daysBetween(startDate: Date, endDate: Date) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));
    return diffDays;
  }
};

export default Goals;