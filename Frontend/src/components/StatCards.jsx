import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/formatters';

function StatCards() {
  const { transactions } = useTransactions();

  const stats = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += transaction.amount;
      }
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 }
  );

  const balance = stats.totalIncome - stats.totalExpenses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Total Income</h3>
        <p className="mt-2 text-3xl font-semibold text-green-600">
          {formatCurrency(stats.totalIncome)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Total Expenses</h3>
        <p className="mt-2 text-3xl font-semibold text-red-600">
          {formatCurrency(stats.totalExpenses)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Balance</h3>
        <p className={`mt-2 text-3xl font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
}

export default StatCards;
