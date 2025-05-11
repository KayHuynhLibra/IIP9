import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useBudgets } from '../hooks/useBudgets';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
);

function Statistics() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'month', 'quarter', 'year'

  // Filter transactions by time
  const filteredTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.date);
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3);
    const transactionQuarter = Math.floor(date.getMonth() / 3);
    
    switch (timeFilter) {
      case 'month':
        return date.getMonth() === now.getMonth() && 
               date.getFullYear() === now.getFullYear();
      case 'quarter':
        return quarter === transactionQuarter && 
               date.getFullYear() === now.getFullYear();
      case 'year':
        return date.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  // Calculate chart data
  const monthlyData = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].expenses += transaction.amount;
    }
    
    return acc;
  }, {});

  // Calculate category data
  const categoryData = filteredTransactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
    }
    return acc;
  }, {});

  // Compare with previous month
  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 7);
  
  const currentMonthExpenses = monthlyData[currentMonth]?.expenses || 0;
  const lastMonthExpenses = monthlyData[lastMonth]?.expenses || 0;
  const expenseChange = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

  // Financial metrics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  const averageDailyExpense = totalExpenses / 30; // Assuming 30 days

  // Bar chart data
  const barChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Income',
        data: Object.values(monthlyData).map(d => d.income),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1
      },
      {
        label: 'Expenses',
        data: Object.values(monthlyData).map(d => d.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }
    ]
  };

  // Pie chart data
  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 206, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
      ],
      borderWidth: 1
    }]
  };

  // Tổng ngân sách và tổng chi tiêu thực tế của các category có ngân sách
  const totalBudget = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => {
    return sum + filteredTransactions
      .filter(t => t.category === b.category && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0);
  }, 0);
  const totalBudgetPercent = totalBudget > 0 ? (totalBudgetSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen p-4">
      {/* Time filter */}
      <div className="flex justify-end space-x-4">
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-900"
        >
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-bold text-blue-700">Total Income</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-bold text-blue-700">Total Expenses</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-sm text-gray-500">
            vs Last Month: 
            <span className={expenseChange >= 0 ? 'text-red-500' : 'text-green-500'}>
              {expenseChange >= 0 ? '↑' : '↓'} {Math.abs(expenseChange).toFixed(1)}%
            </span>
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-bold text-blue-700">Balance</h3>
          <p className={`mt-2 text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
          <p className="text-sm text-gray-500">
            Savings Rate: {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Tổng hợp ngân sách */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-blue-700">Total Budget</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="mt-2">
            <span className="text-gray-700 font-medium">Spent: </span>
            <span className="font-bold text-red-600">{formatCurrency(totalBudgetSpent)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 my-2">
            <div
              className={`${totalBudgetPercent > 90 ? 'bg-red-500' : totalBudgetPercent > 70 ? 'bg-yellow-400' : 'bg-green-500'} h-3 rounded-full`}
              style={{ width: `${Math.min(totalBudgetPercent, 100)}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-500 font-semibold">
            {totalBudgetPercent.toFixed(1)}% used
            {totalBudgetPercent > 100 && <span className="ml-2 text-red-600 font-bold"> (Over budget!)</span>}
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Average Daily Expense</h4>
          <p className="mt-1 text-xl font-semibold">{formatCurrency(averageDailyExpense)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Total Transactions</h4>
          <p className="mt-1 text-xl font-semibold">{filteredTransactions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Largest Transaction</h4>
          <p className="mt-1 text-xl font-semibold">
            {formatCurrency(Math.max(...filteredTransactions.map(t => t.amount)))}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Average Transaction</h4>
          <p className="mt-1 text-xl font-semibold">
            {formatCurrency(filteredTransactions.reduce((sum, t) => sum + t.amount, 0) / filteredTransactions.length || 0)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Monthly Income vs Expenses</h3>
          <Bar 
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Monthly Income and Expenses'
                }
              }
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Expense Distribution</h3>
          <Pie 
            data={pieChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                }
              }
            }}
          />
        </div>
      </div>

      {/* Budget Tracking */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Budget Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map(budget => {
            const spent = filteredTransactions
              .filter(t => t.category === budget.category && t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
            
            const percentage = (spent / budget.amount) * 100;
            
            return (
              <div key={budget._id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{budget.category}</h4>
                  <span className={`text-sm font-medium ${
                    percentage > 90 ? 'text-red-600' : 
                    percentage > 70 ? 'text-yellow-600' : 
                    'text-green-600'
                  }`}>
                    {formatPercentage(percentage)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                    className={`h-2.5 rounded-full ${
                      percentage > 90 ? 'bg-red-600' : 
                      percentage > 70 ? 'bg-yellow-600' : 
                      'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Spent: {formatCurrency(spent)}</span>
                  <span>Budget: {formatCurrency(budget.amount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
