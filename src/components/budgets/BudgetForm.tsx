import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Budget } from '../../types';

interface BudgetFormProps {
  onClose: () => void;
  editBudget?: Budget;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onClose, editBudget }) => {
  const { addBudget, updateBudget, categories } = useFinance();
  
  const [formData, setFormData] = useState<Omit<Budget, 'id'>>({
    name: editBudget?.name || '',
    amount: editBudget?.amount || 0,
    period: editBudget?.period || 'monthly',
    categoryId: editBudget?.categoryId || undefined,
    startDate: editBudget?.startDate || new Date().toISOString().split('T')[0],
    endDate: editBudget?.endDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editBudget) {
      updateBudget({ ...formData, id: editBudget.id });
    } else {
      addBudget(formData);
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
        {editBudget ? 'Edit Budget' : 'Create Budget'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Budget Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Monthly Groceries"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Budget Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="period"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Budget Period
          </label>
          <select
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Category (Optional)
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
          >
            <option value="">All Categories</option>
            {categories
              .filter((cat) => !['Salary', 'Investment'].includes(cat.name))
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            End Date (Optional)
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
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
            {editBudget ? 'Update' : 'Create'} Budget
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;