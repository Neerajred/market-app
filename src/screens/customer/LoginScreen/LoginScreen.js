import React from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../Toast/ToastProvider';

function Login({ handleLogin, error, showModal, setEmail, setPassword, email, password }) {
  const { addToast } = useToast();

  React.useEffect(() => {
    if (error) {
      addToast(error, 'error');
    }
  }, [error, addToast]);

  React.useEffect(() => {
    if (showModal) {
      const role = localStorage.getItem('userRole');
      addToast('Login successful!', 'success');
      
      // Delay briefly to allow toast to be seen
      setTimeout(() => {
        if (role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/';
        }
      }, 500);
    }
  }, [showModal, addToast]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-emerald-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-300 rounded-full opacity-20 animate-bounce"></div>
      </div>

      {/* Decorative SVG Background */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-green-600" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating Shopping Bag SVG */}
      <div className="absolute top-20 right-10 opacity-20 animate-float">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 30 L30 80 L70 80 L80 30 Z" fill="#22c55e" opacity="0.6" />
          <path d="M35 30 Q35 15, 50 15 Q65 15, 65 30" stroke="#16a34a" strokeWidth="3" fill="none" />
          <circle cx="40" cy="50" r="3" fill="#16a34a" />
          <circle cx="60" cy="50" r="3" fill="#16a34a" />
        </svg>
      </div>

      {/* Floating Cart SVG */}
      <div className="absolute bottom-40 left-10 opacity-20 animate-float-delayed">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="30" width="40" height="30" fill="#22c55e" opacity="0.6" rx="4" />
          <circle cx="30" cy="65" r="4" fill="#16a34a" />
          <circle cx="50" cy="65" r="4" fill="#16a34a" />
          <path d="M15 20 L20 30 L60 30" stroke="#16a34a" strokeWidth="3" fill="none" />
        </svg>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fadeInUp max-h-full overflow-y-auto custom-scrollbar p-1">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-4">
            {/* Animated User Icon */}
            <div className="inline-block bg-gradient-to-br from-green-100 to-green-200 rounded-full p-2 mb-2 animate-bounce-slow">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Welcome Back</h2>
          </div>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm transition duration-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm transition duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded-lg hover:from-green-700 hover:to-green-800 font-semibold text-base shadow hover:shadow-md transition duration-200"
            >
              Sign In
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-1 group">
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
