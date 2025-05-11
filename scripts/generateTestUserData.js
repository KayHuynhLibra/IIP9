const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const userData = {
  name: 'Test User 100',
  email: 'testuser100@example.com',
  password: 'TestUser100@123'
};

const budgetCategories = [
  'Food', 'Transport', 'Shopping', 'Bills', 'Health'
];

async function registerUser() {
  try {
    const res = await axios.post(`${API_URL}/users/register`, userData);
    return res.data.token;
  } catch (err) {
    if (err.response && err.response.status === 400) {
      // Nếu user đã tồn tại, đăng nhập
      return loginUser();
    }
    throw err;
  }
}

async function loginUser() {
  const res = await axios.post(`${API_URL}/users/login`, {
    email: userData.email,
    password: userData.password
  });
  return res.data.token;
}

async function createBudgets(token) {
  const budgets = [];
  for (const category of budgetCategories) {
    const budget = {
      category,
      amount: Math.floor(Math.random() * 2000) + 500,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    const res = await axios.post(`${API_URL}/budgets`, budget, {
      headers: { Authorization: `Bearer ${token}` }
    });
    budgets.push(res.data);
  }
  return budgets;
}

function randomAmount() {
  return Math.floor(Math.random() * 1000) + 1;
}

function randomType() {
  return Math.random() > 0.5 ? 'income' : 'expense';
}

function randomDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 60);
  now.setDate(now.getDate() - daysAgo);
  return now.toISOString().split('T')[0];
}

async function createTransactions(token, budgets) {
  for (let i = 0; i < 100; i++) {
    // Chọn ngẫu nhiên 1 budget
    const budget = budgets[Math.floor(Math.random() * budgets.length)];
    const transaction = {
      description: `Test transaction ${i + 1}`,
      amount: randomAmount(),
      type: randomType(),
      category: budget.category,
      budget: budget._id, // hoặc budget.category nếu muốn hiển thị tên
      date: randomDate()
    };
    await axios.post(`${API_URL}/transactions`, transaction, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if ((i + 1) % 10 === 0) console.log(`Created ${i + 1} transactions`);
  }
}

(async () => {
  try {
    const token = await registerUser();
    console.log('User ready, token:', token.slice(0, 20) + '...');
    const budgets = await createBudgets(token);
    console.log('Budgets created:', budgets.map(b => b.category).join(', '));
    await createTransactions(token, budgets);
    console.log('Done creating 100 transactions!');
  } catch (err) {
    console.error('Error:', err.message);
  }
})(); 