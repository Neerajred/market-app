import React from 'react';

// Full-page loader (for initial page loads)
export const PageLoader = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center gap-6">
    <div className="relative">
      {/* Spinning ring */}
      <div className="w-20 h-20 border-4 border-green-100 border-t-green-500 rounded-full animate-spin" />
      {/* Center cart icon */}
      <div className="absolute inset-0 flex items-center justify-center text-2xl">
        🛒
      </div>
    </div>
    <div className="text-center">
      <p className="text-green-700 font-bold text-lg">{message}</p>
      <p className="text-gray-400 text-sm mt-1">Fresh Mart · India's Fresh Market</p>
    </div>
    {/* Animated dots */}
    <div className="flex gap-1.5">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  </div>
);

// Inline section loader (inside cards/sections)
export const SectionLoader = ({ message = 'Fetching data...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <div className="relative">
      <div className="w-12 h-12 border-3 border-green-100 border-t-green-500 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center text-lg">🌿</div>
    </div>
    <p className="text-gray-400 text-sm font-medium">{message}</p>
  </div>
);

// Skeleton card (for product grid)
export const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse">
    <div className="h-40 bg-gray-100 rounded-xl mb-4" />
    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
    <div className="flex justify-between items-center">
      <div className="h-5 bg-gray-100 rounded w-1/4" />
      <div className="h-8 bg-gray-100 rounded-lg w-1/3" />
    </div>
  </div>
);

// Small spinner (for buttons/inline use)
export const Spinner = ({ size = 4, color = 'green' }) => (
  <div
    className={`w-${size} h-${size} border-2 border-${color}-200 border-t-${color}-600 rounded-full animate-spin`}
  />
);

export default PageLoader;
