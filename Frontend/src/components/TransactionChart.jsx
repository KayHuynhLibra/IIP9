import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function TransactionChart({ transactions }) {
  // Group transactions by date and sum income/expense per day
  const grouped = {};
  transactions.forEach(tx => {
    const date = new Date(tx.date).toLocaleDateString();
    if (!grouped[date]) grouped[date] = { income: 0, expense: 0 };
    if (tx.type === 'income') grouped[date].income += tx.amount;
    else if (tx.type === 'expense') grouped[date].expense += tx.amount;
  });
  const labels = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
  const incomeData = labels.map(date => grouped[date].income);
  const expenseData = labels.map(date => grouped[date].expense);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
        pointRadius: 2,
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Transaction History',
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 15
        }
      },
      y: {
        beginAtZero: true,
      },
    },
    elements: {
      point: { radius: 2 }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <Line data={data} options={options} />
    </div>
  );
}

export default TransactionChart;
