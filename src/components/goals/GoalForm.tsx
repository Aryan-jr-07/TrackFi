import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Goal } from '../../types';

interface GoalFormProps {
  onClose: () => void;
  editGoal?: Goal;
}

const GoalForm: React.FC<GoalFormProps> = ({ onClose, editGoal }) => {
  const { addGoal, updateGoal, categories } = useFinance();
  
  const [formData, setFormData] = useState<Omit<Goal, 'id'>>({
    name: editGoal?.name || '',
    targetAmount: editGoal?.targetAmount || 0,
    currentAmount: editGoal?.currentAmount || 0,
    startDate: editGoal?.startDate || new Date().toISOString().split('T')[0],
    deadline: editGoal?.deadline || '',
    category: editGoal?.category || '',
    priority: editGoal?.priority || 'medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editGoal) {
      updateGoal({ ...formData, id: editGoal.id });
    } else {
      addGoal(formData);
    }
    
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        {editGoal ? 'Edit Goal' : 'Create Goal'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Goal Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Emergency Fund"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="targetAmount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Target Amount
          </label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            min="0"
            step="0.01"
            value={formData.targetAmount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="currentAmount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Current Amount
          </label>
          <input
            type="number"
            id="currentAmount"
            name="currentAmount"
            min="0"
            step="0.01"
            value={formData.currentAmount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Category (Optional)
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
          >
            <option value="">None</option>
            <option value="Emergency Fund">Emergency Fund</option>
            <option value="Retirement">Retirement</option>
            <option value="Vacation">Vacation</option>
            <option value="Education">Education</option>
            <option value="Home">Home</option>
            <option value="Car">Car</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Deadline (Optional)
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {editGoal ? 'Update' : 'Create'} Goal
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;