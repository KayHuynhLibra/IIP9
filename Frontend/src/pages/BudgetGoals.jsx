import React from 'react';
import useAuth from '../hooks/useAuth';

const BudgetGoals = () => {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Budget Goals</h2>
      {user ? (
        <p>Manage your budget goals, {user.email}.</p>
      ) : (
        <p>Please log in to manage your budget goals.</p>
      )}
    </div>
  );
};

export default BudgetGoals;