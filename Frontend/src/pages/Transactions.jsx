import React from 'react';
import useAuth from '../hooks/useAuth';

const Transactions = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 bg-green-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 border-4 border-green-500 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Transactions</h2>
        {user ? (
          <div className="text-center">
            <p className="text-xl text-gray-800 mb-4">Here are your transactions, <span className="font-semibold text-green-600">{user.email}</span>.</p>
            <div className="mt-6">
              <div className="bg-green-50 p-4 rounded-lg shadow-inner">
                <p className="text-lg text-green-800">Transaction List Coming Soon!</p>
                <p className="text-gray-600">Track your expenses and income here.</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">Please log in to view your transactions.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;