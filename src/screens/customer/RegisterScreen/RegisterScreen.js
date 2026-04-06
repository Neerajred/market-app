import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { authAPI } from '../../../services/api';
import { useToast } from '../../Toast/ToastProvider';

function Register() {
  const { addToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumberValid, setMobileNumberValid] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailExists, setEmailExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnter, setShowReEnter] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      addToast(error, 'error');
    }
  }, [error, addToast]);

  const handleEmailBlur = async () => {
    if (!email) return;
    try {
      const data = await authAPI.checkEmail(email);
      setEmailExists(data.exists);
      if (data.exists) {
        addToast('Email already registered', 'warning');
      }
    } catch (error) {
      console.error('Email check error:', error);
      setEmailExists(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const isMatch = password === confirmPassword;
    const isMobileValid = /^\d{10}/.test(mobileNumber);

    setPasswordMatch(isMatch);
    setMobileNumberValid(isMobileValid);

    if (!isMatch) {
      addToast('Passwords do not match', 'error');
      return;
    }

    if (!isMobileValid) {
      addToast('Enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (emailExists) {
      addToast('Email already exists. Please login or use another.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const data = await authAPI.register({
        fullName,
        email,
        mobileNumber,
        password
      });

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', fullName);

        const userProfile = {
          fullName: fullName,
          email: email,
          phone: mobileNumber,
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        addToast('Registration successful! Welcome.', 'success');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleSetShowReEnter = () => setShowReEnter(!showReEnter);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 py-4 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-24 h-24 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-10 w-32 h-32 bg-green-300 rounded-full opacity-20 animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-green-200 rounded-full opacity-20 animate-bounce"></div>
      </div>

      {/* Floating Vegetables SVG */}
      <div className="absolute top-10 left-20 opacity-20 animate-float">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="20" fill="#22c55e" opacity="0.6" />
          <path d="M40 20 Q50 30, 40 40 Q30 30, 40 20" fill="#16a34a" opacity="0.8" />
          <circle cx="35" cy="35" r="3" fill="#dcfce7" />
          <circle cx="45" cy="35" r="3" fill="#dcfce7" />
        </svg>
      </div>

      {/* Floating Fruit SVG */}
      <div className="absolute bottom-20 right-10 opacity-20 animate-float-delayed">
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="35" cy="40" r="18" fill="#22c55e" opacity="0.7" />
          <ellipse cx="35" cy="25" rx="8" ry="5" fill="#16a34a" opacity="0.8" />
          <path d="M35 25 Q38 18, 35 15" stroke="#16a34a" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="w-full max-w-lg relative z-10 animate-fadeInUp max-h-full overflow-y-auto custom-scrollbar p-1">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="text-center mb-4">
            <div className="inline-block bg-gradient-to-br from-green-100 to-emerald-200 rounded-full p-2 mb-2 animate-bounce-slow">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Create Account</h2>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm transition duration-200"
                placeholder="John Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm transition duration-200 ${emailExists ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="mobileNumber" className="block text-xs font-semibold text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm transition duration-200 ${!mobileNumberValid ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm transition duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600 hover:text-gray-800"
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showReEnter ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm transition duration-200"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={toggleSetShowReEnter}
                    className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-600 hover:text-gray-800"
                  >
                    {showReEnter ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg transition duration-200 font-semibold text-base shadow hover:shadow-md mt-2 ${isLoading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                }`}
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Sign in
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

export default Register;
