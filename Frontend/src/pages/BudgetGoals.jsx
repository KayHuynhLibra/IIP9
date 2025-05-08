import React from 'react';
import useAuth from '../hooks/useAuth';

const BudgetGoals = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 bg-orange-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 border-4 border-orange-500 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-orange-700 mb-6 text-center">Budget Goals</h2>
        {user ? (
          <div className="text-center">
            <p className="text-xl text-gray-800 mb-4">Manage your budget goals, <span className="font-semibold text-orange-600">{user.email}</span>.</p>
            <div className="mt-6">
              <div className="bg-orange-50 p-4 rounded-lg shadow-inner">
                <p className="text-lg text-orange-800">Budget Goals Coming Soon!</p>
                <p className="text-gray-600">Set and track your financial goals here.</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">Please log in to manage your budget goals.</p>
        )}
      </div>
    </div>
  );
};

export default BudgetGoals;