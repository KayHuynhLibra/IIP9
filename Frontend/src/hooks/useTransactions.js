import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loading: authLoading } = useAuth();

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions');
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      const response = await axios.post('/api/transactions', transactionData);
      setTransactions([...transactions, response.data]);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions(transactions.filter(t => t._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete transaction');
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchTransactions();
    }
  }, [authLoading]);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions
  };
}
