import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiTick } from "react-icons/ti";

const LoginSuccessModal = ({ showModal }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (showModal) {
            // Auto-redirect to home after 1.5 seconds
            const timer = setTimeout(() => {
                navigate('/');
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [showModal, navigate]);

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white flex flex-col items-center rounded-lg p-6 space-y-4 max-w-sm mx-auto">
                <div className="flex items-center justify-center bg-green-200 rounded-full w-fit p-3">
                    <TiTick className='text-3xl text-green-700' />
                </div>
                <h2 className="text-2xl font-bold text-center">Login Successful</h2>
                <p className="text-gray-600 text-sm">Redirecting to home...</p>
            </div>
        </div>
    );
};

export default LoginSuccessModal;
