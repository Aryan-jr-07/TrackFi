export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  budgetLimit?: number;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  period: 'monthly' | 'yearly';
  categoryId?: string;
  startDate: string;
  endDate?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  startDate: string;
  category?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    colorScheme: 'blue' | 'green' | 'purple' | 'teal' | 'orange';
  };
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'blue' | 'green' | 'purple' | 'teal' | 'orange';

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  topExpenseCategories: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}