import React from 'react';
import { AiOutlineUser, AiFillLock } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ handleLogin, error, showModal, email, password, setEmail, setPassword }) => {
  const navigate = useNavigate();

  if (showModal) return null;

  const onFormSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(e);
    // Check if login was successful by checking token existence
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-heading text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500">Sign in to access your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center justify-center">
            {error}
          </div>
        )}

        <form onSubmit={onFormSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">
                <AiOutlineUser className="text-xl" />
              </span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">
                <AiFillLock className="text-xl" />
              </span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            type="submit"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
