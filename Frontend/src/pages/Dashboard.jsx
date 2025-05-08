import React from 'react';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 border-4 border-blue-500 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Dashboard</h2>
        {user ? (
          <div className="text-center">
            <p className="text-xl text-gray-800 mb-4">Welcome, <span className="font-semibold text-blue-600">{user.email}</span>!</p>
            <p className="text-gray-600">This is your dashboard. Manage your finances with ease.</p>
            <div className="mt-6">
              <div className="bg-blue-50 p-4 rounded-lg shadow-inner">
                <p className="text-lg text-blue-800">Quick Overview</p>
                <p className="text-gray-600">Stay tuned for your financial summary!</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">Please log in to view your dashboard.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;