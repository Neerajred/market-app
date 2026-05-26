import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SuccessModal from './modal';
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { authAPI } from '../../services/api';
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone, AiFillLock } from 'react-icons/ai';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobileNumberValid, setMobileNumberValid] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [emailExists, setEmailExists] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnter, setShowReEnter] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailBlur = async () => {
    try {
      const data = await authAPI.checkEmail(email);
      setEmailExists(data.exists);
    } catch (error) {
      console.error('Email check error:', error);
      setEmailExists(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordMatch(password === confirmPassword);
    setMobileNumberValid(/^\d{10}$/.test(mobileNumber));

    if (password !== confirmPassword) {
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      return;
    }

    if (emailExists) {
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

        // Save user profile data for auto-fill
        const userProfile = {
          fullName: fullName,
          email: email,
          phone: mobileNumber,
        };
        localStorage.setItem('userProfile', JSON.stringify(userProfile));

        setShowModal(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleSetShowReEnter = () => {
    setShowReEnter(!showReEnter);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 py-8 px-4 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="w-full max-w-md relative z-10 animate-fadeInUp">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500 mt-2">Join us and start shopping</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <AiOutlineUser className="text-xl" />
                </span>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <AiOutlineMail className="text-xl" />
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400 ${emailExists ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="you@example.com"
                />
              </div>
              {emailExists && (
                <p className="text-sm text-red-500 mt-1">Email already exists</p>
              )}
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <AiOutlinePhone className="text-xl" />
                </span>
                <input
                  type="text"
                  id="mobileNumber"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400 ${!mobileNumberValid ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="1234567890"
                />
              </div>
              {!mobileNumberValid && (
                <p className="text-sm text-red-500 mt-1">Please enter a valid 10-digit mobile number</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <AiFillLock className="text-xl" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <AiFillLock className="text-xl" />
                </span>
                <input
                  type={showReEnter ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={toggleSetShowReEnter}
                  className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-slate-600"
                >
                  {showReEnter ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {!passwordMatch && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">Passwords do not match</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-6 ${isLoading
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center animate-fadeIn delay-300">
            <p className="text-slate-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <SuccessModal showModal={showModal} />
    </div>
  );
}

export default Register;
