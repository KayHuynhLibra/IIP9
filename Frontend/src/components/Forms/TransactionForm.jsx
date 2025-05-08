import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const TransactionForm = ({ onSuccess }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    type: 'expense',
  });
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/transactions', formData, { withCredentials: true });
      if (res.data.warning) {
        setWarning(res.data.warning);
      } else {
        setFormData({
          amount: '',
          category: '',
          description: '',
          type: 'expense',
        });
        setWarning(null);
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label className="block">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
      </div>
      <div>
        <label className="block">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-2"
          required
        />
      </div>
      <div>
        <label className="block">Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full border p-2"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {warning && <p className="text-yellow-500">{warning}</p>}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;