import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import StatCards from '../components/StatCards';
import TransactionChart from '../components/TransactionChart';
import TransactionList from '../components/TransactionList';
import { formatCurrency } from '../utils/formatters';

function Dashboard() {
  const { user } = useAuth();
  const { transactions, loading: transactionsLoading } = useTransactions();
  const { budgets, loading: budgetsLoading } = useBudgets();

  if (transactionsLoading || budgetsLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome back, {user?.name}
        </p>
      </div>
      
      <StatCards transactions={transactions} budgets={budgets} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionChart transactions={transactions} />
        <TransactionList transactions={transactions.slice(0, 5)} />
      </div>

      {/* Budget Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets
          .filter(budget => budget.amount > 0 && budget.spent / budget.amount >= 0.8)
          .map(budget => {
            const percent = Math.min((budget.spent / budget.amount) * 100, 100);
            let progressColor = 'bg-green-500';
            if (percent > 90) progressColor = 'bg-red-500';
            else if (percent > 80) progressColor = 'bg-yellow-400';
            return (
              <div
                key={budget._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-600">{budget.category}</span>
                  {percent > 100 && (
                    <span className="ml-2 text-red-600 font-bold">Over budget!</span>
                  )}
                </div>
                <div className="text-gray-700 text-base">
                  Budget: <span className="font-bold">{formatCurrency(budget.amount)}</span>
                </div>
                <div className="text-gray-500 text-base">
                  Spent: <span className="font-bold">{formatCurrency(budget.spent)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 my-2">
                  <div
                    className={`${progressColor} h-3 rounded-full`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-500 font-semibold">
                  {percent.toFixed(1)}% used
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Dashboard;