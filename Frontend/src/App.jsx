import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetGoals from './pages/BudgetGoals';
import ErrorBoundary from './components/ErrorBoundary';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Login
        </button>
      </form>
    </div>
  );
};

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.password);
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <div>
          <label className="block">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Register
        </button>
      </form>
    </div>
  );
};

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <AuthProvider>
      <ErrorBoundary>
        <div>
          <h1 className="text-3xl font-bold text-center p-4">Debug: App is rendering</h1>
          <Router>
            <div className="min-h-screen bg-gray-100">
              <nav className="bg-blue-600 text-white p-4">
                <div className="max-w-7xl mx-auto flex justify-between">
                  <div className="space-x-4">
                    <Link to="/" className="hover:underline">Dashboard</Link>
                    <Link to="/transactions" className="hover:underline">Transactions</Link>
                    <Link to="/budget-goals" className="hover:underline">Budget Goals</Link>
                  </div>
                  <div>
                    {user ? (
                      <button onClick={logout} className="hover:underline">
                        Logout
                      </button>
                    ) : (
                      <>
                        <Link to="/login" className="hover:underline mr-4">Login</Link>
                        <Link to="/register" className="hover:underline">Register</Link>
                      </>
                    )}
                  </div>
                </div>
              </nav>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budget-goals" element={<BudgetGoals />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </div>
          </Router>
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;