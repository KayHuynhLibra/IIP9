import { useState } from 'react';
import { useBudgets } from '../hooks/useBudgets';

function BudgetForm({ onClose }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    spent: 0,
    startDate: '',
    endDate: ''
  });
  const { addBudget } = useBudgets();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!formData.category.trim() || !formData.amount || Number(formData.amount) <= 0 || !formData.startDate || !formData.endDate) {
      setError('Please fill in all fields correctly.');
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('End Date must be after Start Date.');
      return;
    }
    try {
      const dataToSend = {
        category: formData.category,
        amount: Number(formData.amount),
        spent: 0,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };
      await addBudget(dataToSend);
      setSuccess('Budget added successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1200);
    } catch (error) {
      setError('Failed to add budget. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Add Budget</h2>
      {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
      {success && <div className="text-green-600 text-sm font-medium">{success}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Amount</label>
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
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
      >
        Add Budget
      </button>
    </form>
  );
}

export default BudgetForm;