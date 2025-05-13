import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';

interface TransactionFormProps {
  onClose: () => void;
  editTransaction?: Transaction;
}

import { Transaction } from '../../types';

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, editTransaction }) => {
  const { addTransaction, updateTransaction, categories } = useFinance();
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>({
    amount: editTransaction?.amount || 0,
    description: editTransaction?.description || '',
    category: editTransaction?.category || '',
    date: editTransaction?.date || new Date().toISOString().split('T')[0],
    type: editTransaction?.type || 'expense',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTransaction) {
      updateTransaction({ ...formData, id: editTransaction.id });
    } else {
      addTransaction(formData);
    }
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
        {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-primary-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Income</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleChange}
                className="form-radio h-4 w-4 text-primary-600"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Expense</span>
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Amount
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
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
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
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
            required
          >
            <option value="">Select a category</option>
            {categories
              .filter((cat) => {
                // Filter categories based on transaction type
                if (formData.type === 'income') {
                  return ['Salary', 'Investment', 'Other'].includes(cat.name);
                }
                return !['Salary', 'Investment'].includes(cat.name);
              })
              .map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring focus:ring-primary-200 focus:border-primary-500"
            required
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
            {editTransaction ? 'Update' : 'Add'} Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;