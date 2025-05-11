import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Sample categories
const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health & Medical',
  'Education',
  'Travel',
  'Personal Care',
  'Others'
];

// Sample transaction descriptions
const descriptions = [
  'Grocery shopping',
  'Restaurant dinner',
  'Movie tickets',
  'Bus fare',
  'Online shopping',
  'Electricity bill',
  'Doctor visit',
  'Course materials',
  'Vacation expenses',
  'Haircut'
];

// Generate random date within last 30 days
const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date.toISOString().split('T')[0];
};

// Generate random amount between min and max
const getRandomAmount = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Create sample transactions
const createSampleTransactions = async () => {
  const transactions = [];
  
  // Create 5 income transactions
  for (let i = 0; i < 5; i++) {
    transactions.push({
      type: 'income',
      amount: getRandomAmount(1000, 5000),
      category: 'Salary',
      description: 'Monthly salary',
      date: getRandomDate()
    });
  }

  // Create 5 expense transactions
  for (let i = 0; i < 5; i++) {
    transactions.push({
      type: 'expense',
      amount: getRandomAmount(50, 500),
      category: categories[Math.floor(Math.random() * categories.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      date: getRandomDate()
    });
  }

  // Add transactions to database
  try {
    for (const transaction of transactions) {
      await axios.post(`${API_URL}/transactions`, transaction);
      console.log('Added transaction:', transaction);
    }
    console.log('Successfully added all transactions');
  } catch (error) {
    console.error('Error adding transactions:', error);
  }
};

// Create sample budgets
const createSampleBudgets = async () => {
  const budgets = categories.slice(0, 5).map(category => ({
    category,
    amount: getRandomAmount(500, 2000),
    period: 'monthly'
  }));

  // Add budgets to database
  try {
    for (const budget of budgets) {
      await axios.post(`${API_URL}/budgets`, budget);
      console.log('Added budget:', budget);
    }
    console.log('Successfully added all budgets');
  } catch (error) {
    console.error('Error adding budgets:', error);
  }
};

// Main function to seed all data
const seedData = async () => {
  try {
    console.log('Starting to seed data...');
    await createSampleTransactions();
    await createSampleBudgets();
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Run the seed function
seedData(); 