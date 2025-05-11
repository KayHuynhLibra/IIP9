import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export function useBudgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loading: authLoading } = useAuth();

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('/api/budgets');
      setBudgets(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (budgetData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/budgets',
        budgetData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      await fetchBudgets();
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add budget');
    }
  };

  const updateBudget = async (id, budgetData) => {
    try {
      const response = await axios.put(`/api/budgets/${id}`, budgetData);
      setBudgets(budgets.map(b => b._id === id ? response.data : b));
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update budget');
    }
  };

  const deleteBudget = async (id) => {
    try {
      await axios.delete(`/api/budgets/${id}`);
      setBudgets(budgets.filter(b => b._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete budget');
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchBudgets();
    }
  }, [authLoading]);

  return {
    budgets,
    loading,
    error,
    addBudget,
    updateBudget,
    deleteBudget,
    refreshBudgets: fetchBudgets
  };
}
