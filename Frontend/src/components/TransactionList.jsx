import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { formatCurrency } from '../utils/formatters';
import TransactionForm from './TransactionForm';

function TransactionList({ transactions = [] }) {
  const { loading, error, deleteTransaction, refreshTransactions } = useTransactions();
  const { budgets } = useBudgets();
  const [showForm, setShowForm] = useState(false);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 text-center text-gray-500 font-semibold">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recent Transactions</h2>
      <div className="flex justify-center mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-3 rounded-xl shadow transition block"
          onClick={() => setShowForm(true)}
        >
          + Add Transaction
        </button>
      </div>
      {showForm && (
        <TransactionForm onClose={() => setShowForm(false)} />
      )}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {(() => {
              let runningTotal = 0;
              const sortedTx = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
              return sortedTx.map((transaction) => {
                if (transaction.type === 'income') {
                  runningTotal += transaction.amount;
                } else {
                  runningTotal -= transaction.amount;
                }
                let budget = null;
                if (transaction.budget) {
                  budget = budgets.find(b => b._id === transaction.budget || b.category === transaction.category);
                } else if (transaction.category) {
                  budget = budgets.find(b => b.category === transaction.category);
                }
                return (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(transaction.amount)}
                      </span>
                      {transaction.amount > 1000 && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-300 align-middle">
                          <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Large
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.category || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {budget ? budget.category : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {formatCurrency(runningTotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded"
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this transaction?')) {
                            await deleteTransaction(transaction._id);
                            await refreshTransactions();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionList;
