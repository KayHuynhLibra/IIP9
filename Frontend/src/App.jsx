import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetGoals from './pages/BudgetGoals';
import ErrorBoundary from './components/ErrorBoundary';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      await login(formData.email, formData.password);
      setSuccess('Login successful!');
      setTimeout(() => navigate('/'), 2000); // Redirect to Dashboard after 2 seconds
    } catch (err) {
      setError('Login failed: ' + err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      await register(formData.email, formData.password);
      setSuccess('Registration successful!');
      setTimeout(() => navigate('/'), 2000); // Redirect to Dashboard after 2 seconds
    } catch (err) {
      setError('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
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
              <nav className="bg-blue-600 text-white p-4 sticky top-0 shadow-md z-10">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                  <div className="space-x-4">
                    <Link to="/" className="hover:underline font-semibold transition-colors duration-200">Dashboard</Link>
                    <Link to="/transactions" className="hover:underline font-semibold transition-colors duration-200">Transactions</Link>
                    <Link to="/budget-goals" className="hover:underline font-semibold transition-colors duration-200">Budget Goals</Link>
                  </div>
                  <div>
                    {user ? (
                      <button onClick={logout} className="hover:underline font-semibold transition-colors duration-200">
                        Logout
                      </button>
                    ) : (
                      <>
                        <Link to="/login" className="hover:underline font-semibold transition-colors duration-200 mr-4">Login</Link>
                        <Link to="/register" className="hover:underline font-semibold transition-colors duration-200">Register</Link>
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