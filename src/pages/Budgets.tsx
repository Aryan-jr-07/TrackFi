import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetForm from '../components/budgets/BudgetForm';
import Modal from '../components/ui/Modal';
import { Budget } from '../types';

const Budgets: React.FC = () => {
  const { budgets, transactions, categories, deleteBudget } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [editBudget, setEditBudget] = useState<Budget | undefined>(undefined);

  // Calculate spent amount for each budget
  const getBudgetSpent = (budget: Budget) => {
    // Get the category name if categoryId is provided
    let categoryName = '';
    if (budget.categoryId) {
      const category = categories.find((c) => c.id === budget.categoryId);
      categoryName = category?.name || '';
    }

    // Filter transactions by date range and category
    const filteredTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const startDate = new Date(budget.startDate);
      const endDate = budget.endDate ? new Date(budget.endDate) : new Date();
      
      const dateInRange = transactionDate >= startDate && transactionDate <= endDate;
      const typeMatch = t.type === 'expense';
      const categoryMatch = categoryName ? t.category === categoryName : true;
      
      return dateInRange && typeMatch && categoryMatch;
    });

    // Sum up filtered transactions
    return filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const handleEdit = (budget: Budget) => {
    setEditBudget(budget);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      deleteBudget(id);
    }
  };

  const handleAddNew = () => {
    setEditBudget(undefined);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Budgets</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your spending limits and stay on track
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus size={16} className="mr-2" />
          New Budget
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You don't have any budgets yet. Create your first budget to start tracking your spending.
          </p>
          <button
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus size={16} className="mr-2" />
            Create Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              spent={getBudgetSpent(budget)}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <BudgetForm onClose={() => setShowModal(false)} editBudget={editBudget} />
      </Modal>
    </div>
  );
};

export default Budgets;