import React, { useState, useEffect } from 'react';

const NoNetwork = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.reload();
      } else {
        setIsRetrying(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Signal icon animation */}
        <div className="relative mb-8 inline-block">
          <div className="text-8xl select-none">📡</div>
          <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-20" />
        </div>

        <h1 className="text-3xl font-black text-gray-800 mb-3">
          No Internet Connection
        </h1>
        <p className="text-gray-500 mb-2">
          Fresh Mart can't reach the internet right now.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Check your Wi-Fi or mobile data and try again.
        </p>

        {/* Status indicators */}
        <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-gray-100 text-left space-y-3">
          <StatusRow label="Internet Connection" ok={false} />
          <StatusRow label="Fresh Mart Servers" ok={null} />
          <StatusRow label="Cached Data" ok={true} />
        </div>

        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className={`w-full py-3 rounded-xl font-bold transition-all duration-200 shadow-lg ${
            isRetrying
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-green-200 hover:-translate-y-0.5'
          }`}
        >
          {isRetrying ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              Checking connection...
            </span>
          ) : (
            '↻ Try Again'
          )}
        </button>

        <p className="text-xs text-gray-400 mt-4">
          You can still browse previously loaded pages.
        </p>
      </div>
    </div>
  );
};

const StatusRow = ({ label, ok }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    {ok === true && <span className="text-green-500 font-semibold flex items-center gap-1">✓ Available</span>}
    {ok === false && <span className="text-red-500 font-semibold flex items-center gap-1">✗ Unavailable</span>}
    {ok === null && <span className="text-gray-400 flex items-center gap-1">— Unknown</span>}
  </div>
);

// Hook to detect online/offline status
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export default NoNetwork;
