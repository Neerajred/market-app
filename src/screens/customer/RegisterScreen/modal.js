import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiTick } from "react-icons/ti";

const SuccessModal = ({ showModal }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (showModal) {
      // Auto-redirect to login after 2 seconds
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showModal, navigate]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white flex items-center text-center flex-col rounded-lg p-6 space-y-4 max-w-sm mx-auto">
        <div className="flex items-center justify-center bg-green-200 rounded-full w-fit p-3">
        <TiTick  className='text-3xl text-green-700'/>
        </div>
        <h2 className="text-2xl font-bold text-center">Registration Successful</h2>
        <p className='text-gray-500'>Redirecting to login...</p>
      </div>
    </div>
  );
};

export default SuccessModal;
