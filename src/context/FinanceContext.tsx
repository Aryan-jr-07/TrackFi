import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Transaction, Category, Budget, Goal, User, FinanceSummary } from '../types';
import { toast } from 'react-hot-toast';

// Pre-defined categories
const defaultCategories: Category[] = [
  { id: uuidv4(), name: 'Housing', color: '#0ea5e9' },
  { id: uuidv4(), name: 'Food', color: '#22c55e' },
  { id: uuidv4(), name: 'Transportation', color: '#f97316' },
  { id: uuidv4(), name: 'Entertainment', color: '#a855f7' },
  { id: uuidv4(), name: 'Healthcare', color: '#ef4444' },
  { id: uuidv4(), name: 'Utilities', color: '#14b8a6' },
  { id: uuidv4(), name: 'Shopping', color: '#ec4899' },
  { id: uuidv4(), name: 'Education', color: '#6366f1' },
  { id: uuidv4(), name: 'Salary', color: '#22c55e' },
  { id: uuidv4(), name: 'Investment', color: '#0ea5e9' },
  { id: uuidv4(), name: 'Other', color: '#94a3b8' },
];

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  user: User;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  updateUser: (user: Partial<User>) => void;
  getFinanceSummary: () => FinanceSummary;
  exportToCSV: () => void;
}

const defaultUser: User = {
  id: '1',
  name: 'User',
  email: 'user@example.com',
  currency: 'USD',
  preferences: {
    theme: 'system',
    colorScheme: 'blue',
  },
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Transactions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: uuidv4() };
    setTransactions([...transactions, newTransaction]);
    toast.success('Transaction added');
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
    toast.success('Transaction updated');
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
    toast.success('Transaction deleted');
  };

  // Categories
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: uuidv4() };
    setCategories([...categories, newCategory]);
    toast.success('Category added');
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
    toast.success('Category updated');
  };

  const deleteCategory = (id: string) => {
    // Check if category is used in transactions
    const usedInTransactions = transactions.some((t) => {
      const categoryObj = categories.find((c) => c.id === id);
      return categoryObj && t.category === categoryObj.name;
    });

    if (usedInTransactions) {
      toast.error('Cannot delete category that is used in transactions');
      return;
    }

    setCategories(categories.filter((category) => category.id !== id));
    toast.success('Category deleted');
  };

  // Budgets
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = { ...budget, id: uuidv4() };
    setBudgets([...budgets, newBudget]);
    toast.success('Budget added');
  };

  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(budgets.map((budget) => (budget.id === updatedBudget.id ? updatedBudget : budget)));
    toast.success('Budget updated');
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter((budget) => budget.id !== id));
    toast.success('Budget deleted');
  };

  // Goals
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: uuidv4() };
    setGoals([...goals, newGoal]);
    toast.success('Goal added');
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)));
    toast.success('Goal updated');
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    toast.success('Goal deleted');
  };

  // User
  const updateUser = (userData: Partial<User>) => {
    setUser({ ...user, ...userData });
    toast.success('Settings updated');
  };

  // Finance Summary
  const getFinanceSummary = (): FinanceSummary => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Calculate top expense categories
    const expensesByCategory: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    const topExpenseCategories = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      topExpenseCategories,
    };
  };

  // Export data to CSV
  const exportToCSV = () => {
    // Transactions CSV
    const transactionsCSV = [
      'id,amount,description,category,date,type',
      ...transactions.map(
        (t) => `${t.id},${t.amount},"${t.description}","${t.category}","${t.date}","${t.type}"`
      ),
    ].join('\n');

    // Create and download file
    const blob = new Blob([transactionsCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'finance_transactions.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('Transactions exported to CSV');
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        goals,
        user,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        addBudget,
        updateBudget,
        deleteBudget,
        addGoal,
        updateGoal,
        deleteGoal,
        updateUser,
        getFinanceSummary,
        exportToCSV,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};