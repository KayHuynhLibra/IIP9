import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';

function TransactionForm({ onClose }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'income',
    category: '',
    budget: 'N/A'
  });
  const { addTransaction } = useTransactions();
  const { budgets } = useBudgets();
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');


  const handleBudgetChange = (e) => {
    const selectedBudget = budgets.find(b => b._id === e.target.value);
    setFormData({
      ...formData,
      budget: e.target.value,
      category: selectedBudget ? selectedBudget.category : formData.category
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.type === 'expense' && formData.budget && formData.budget !== 'N/A') {
      const budget = budgets.find(b => b._id === formData.budget);
      if (budget) {
        const currentSpent = budget.spent || 0;
        const newTotal = currentSpent + Number(formData.amount);
        if (newTotal > budget.amount) {
          setWarningMessage(`You cannot add this transaction because it will exceed your budget for ${formData.category}.`);
          setShowWarning(true);
          return;
        }
      }
    }
    try {
      const dataToSend = {
        ...formData,
        budget: formData.budget === 'N/A' ? null : formData.budget,
        amount: Number(formData.amount)
      };
      await addTransaction(dataToSend);
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
      setWarningMessage('Failed to add transaction. Please try again.');
      setShowWarning(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Add Transaction</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Amount
        </label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '', budget: 'N/A' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Budget
        </label>
        <select
          value={formData.budget}
          onChange={handleBudgetChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="N/A">N/A</option>
          {budgets.map(b => (
            <option key={b._id} value={b._id}>
              {b.category} ({b.amount})
            </option>
          ))}
        </select>
      </div>

    <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Category
  </label>
  <select
    value={formData.category}
    onChange={(e) => {
      const value = e.target.value;
      setFormData({ ...formData, category: value });
      setSelectedCategory(value);
    }}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
  >
    <option value="Payroll">Payroll</option>
    <option value="Rent">Rent</option>
    <option value="Groceries">Groceries</option>
    <option value="Utilities">Utilities</option>
    <option value="Other">Other</option>
  </select>

  {selectedCategory === 'Other' && (
    <input
      type="text"
      value={formData.category}
      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      placeholder="Enter category name"
      required
    />
  )}
</div>


      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
      >
        Add Transaction
      </button>

      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Warning</h3>
            <p className="mb-4">{warningMessage}</p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default TransactionForm;