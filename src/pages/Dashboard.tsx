import React from 'react';
import FinanceSummary from '../components/dashboard/FinanceSummary';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ExpensesChart from '../components/dashboard/ExpensesChart';
import GoalsProgress from '../components/dashboard/GoalsProgress';
import MonthlyTrend from '../components/dashboard/MonthlyTrend';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <FinanceSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTrend />
        <ExpensesChart />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions />
        <GoalsProgress />
      </div>
    </div>
  );
};

export default Dashboard;