import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import SearchBar from '../components/SearchBar';
import { FaPlus } from "react-icons/fa";


function Transactions() {
  const { transactions, loading, error } = useTransactions();
  const [showForm, setShowForm] = useState(false);
  const [searchParams, setSearchParams] = useState({ searchTerm: '', type: '' });

  const filteredTransactions = transactions.filter(t => {
    const { searchTerm, type } = searchParams;
    const matchesSearch = !searchTerm || (typeof searchTerm === 'string' && t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !type || t.type === type;
    return matchesSearch && matchesType;
  });

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>
      <div className="mb-4">
        <SearchBar onSearch={setSearchParams} />
        <FaPlus onClick={() => setShowForm(true)}
          onDoubleClick={() => {setShowForm(false)}}/>
      </div>
      {showForm && (
        <TransactionForm onClose={() => setShowForm(false)} onSuccess={() => setShowForm(false)} />
      )}
      <TransactionList transactions={filteredTransactions} />
    </div>
  );
}

export default Transactions;