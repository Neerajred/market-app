import React from 'react';
import { FaUser, FaSignOutAlt, FaBox } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile({username, handleLogout, setShowProfile}) {
  const navigate = useNavigate();

  const onLogoutClick = () => {
    handleLogout(navigate);
  };

  const onViewOrdersClick = () => {
    setShowProfile(false);
    navigate('/profile');
  };

  return (
    <div className='absolute bg-white shadow-2xl rounded-lg top-16 right-2 sm:right-4 z-50 w-64 sm:w-72 border border-gray-200 animate-fadeIn'>
      <div className='bg-gradient-to-r from-green-500 to-green-600 rounded-t-lg p-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-white rounded-full p-3'>
            <FaUser className='text-green-600 text-2xl' />
          </div>
          <div className='text-white'>
            <p className='text-xs uppercase tracking-wide'>Welcome</p>
            <h2 className='font-bold text-lg truncate'>{username || 'User'}!</h2>
          </div>
        </div>
      </div>
      
      <div className='p-4 space-y-3'>
        <div className='bg-gray-50 rounded-lg p-3 border border-gray-200'>
          <p className='text-xs text-gray-500 mb-1'>Account Status</p>
          <p className='text-sm font-semibold text-green-600'>● Active</p>
        </div>

        <button
          onClick={onViewOrdersClick}
          className='w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg'
        >
          <FaBox />
          View Orders
        </button>

        <button 
          className='w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-semibold transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg'
          onClick={onLogoutClick}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}
