import React from 'react';
import useAuth from '../hooks/useAuth';

const Transactions = () => {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      {user ? (
        <p>Here are your transactions, {user.email}.</p>
      ) : (
        <p>Please log in to view your transactions.</p>
      )}
    </div>
  );
};

export default Transactions;