import { useState } from 'react';
import { useBudgets } from '../hooks/useBudgets';
import BudgetForm from '../components/BudgetForm';
import { formatCurrency } from '../utils/formatters';

function BudgetGoals() {
  const { budgets, loading, error } = useBudgets();
  const [showForm, setShowForm] = useState(false);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Budget Goals</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Budget
        </button>
      </div>

      {showForm && (
        <BudgetForm
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(budget => {
          const percent = Math.min((budget.spent / budget.amount) * 100, 100);
          let progressColor = 'bg-green-500';
          if (percent > 90) progressColor = 'bg-red-500';
          else if (percent > 70) progressColor = 'bg-yellow-400';

          return (
            <div
              key={budget._id}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-blue-600">{budget.category}</span>
              </div>
              <div className="text-gray-700 text-2xl">
                Budget: <span className="font-bold">{formatCurrency(budget.amount)}</span>
              </div>
              <div className="text-gray-500 text-xl">
                Spent: <span className="font-bold">{formatCurrency(budget.spent)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 my-3">
                <div
                  className={`${progressColor} h-4 rounded-full`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <div className="text-right text-lg text-gray-500 font-semibold">
                {percent.toFixed(1)}% used
              </div>
              <div className="text-base text-gray-400">
                {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BudgetGoals;