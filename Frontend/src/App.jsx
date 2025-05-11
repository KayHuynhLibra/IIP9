import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetGoals from './pages/BudgetGoals';
import Login from './pages/Login';
import Register from './pages/Register';
import Statistics from './components/Statistics';
import ExportImport from './components/ExportImport';
import Notifications from './components/Notifications';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/user" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/budgets" element={<BudgetGoals />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/export-import" element={<ExportImport />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <Notifications />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;