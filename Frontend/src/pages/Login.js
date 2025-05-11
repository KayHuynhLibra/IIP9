// Frontend/src/pages/Login.js
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { motion } from 'framer-motion';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Left side - Image and Welcome Text */}
          <motion.div 
            className="w-full lg:w-1/2 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Welcome Back!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Sign in to manage your budget and track your expenses
            </p>
            <div className="hidden lg:block">
              <img 
                src="/images/ip9-banner.jpg" 
                alt="IP9 Kim and Kelly"
                className="w-full max-w-md mx-auto rounded-xl shadow-lg"
              />
            </div>
          </motion.div>

          {/* Right side - Login Form */}
          <motion.div 
            className="w-full lg:w-1/2 max-w-md"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
                Sign In
              </h2>
              <LoginForm />
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => navigate('/register')}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;