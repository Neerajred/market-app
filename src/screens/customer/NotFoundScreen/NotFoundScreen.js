import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Animated cart icon */}
        <div className="relative mb-8">
          <div className="text-9xl animate-bounce select-none">🛒</div>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
            404
          </div>
        </div>

        <h1 className="text-4xl font-black text-gray-800 mb-3">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-500 mb-2 text-lg">
          Looks like this aisle doesn't exist.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          The page you're looking for might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            🏠 Back to Store
          </button>
          <button
            onClick={() => navigate(-1)}
            className="border-2 border-green-200 text-green-700 hover:bg-green-50 px-8 py-3 rounded-xl font-bold transition-all duration-200"
          >
            ← Go Back
          </button>
        </div>

        {/* Decorative items */}
        <div className="mt-12 flex justify-center gap-6 opacity-30 text-4xl select-none">
          <span className="animate-pulse">🍎</span>
          <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>🥦</span>
          <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>🥛</span>
          <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>🍞</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
