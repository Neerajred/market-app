import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaMapMarkerAlt } from 'react-icons/fa';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem('lastOrder');
    if (!lastOrder) {
      navigate('/');
      return;
    }
    setOrderData(JSON.parse(lastOrder));
  }, [navigate]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-emerald-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-300 rounded-full opacity-20 animate-bounce"></div>
      </div>

      {/* Confetti Effect SVG */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#22c55e', '#16a34a', '#dcfce7', '#86efac'][Math.floor(Math.random() * 4)]
              }}
            />
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 text-center mb-6 animate-fadeInUp">
          {/* Success Check Animation */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <FaCheckCircle className="relative text-green-600 text-6xl animate-bounce-slow" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 animate-fadeIn">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-4 animate-fadeIn delay-200">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          
          {/* Animated Success Illustration */}
          <div className="my-6 flex justify-center animate-fadeIn delay-300">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="60" cy="60" r="50" fill="#dcfce7" className="animate-pulse"/>
              <path d="M35 60 L50 75 L85 40" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="animate-draw"/>
              <circle cx="60" cy="60" r="50" stroke="#22c55e" strokeWidth="3" fill="none"/>
            </svg>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 inline-block animate-fadeIn delay-400">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-xl font-bold text-green-700">{orderData.orderId}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaBox className="text-green-600" />
            Order Details
          </h2>
          
          <div className="space-y-3">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">{item.name}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-600">${item.price} each</p>
                </div>
                <p className="font-semibold text-sm sm:text-base">{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{(parseFloat(orderData.total) / 1.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (8%)</span>
              <span className="font-medium">{(parseFloat(orderData.total) - parseFloat(orderData.total) / 1.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total Paid</span>
              <span className="text-green-600">${orderData.total}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-600" />
            Shipping Address
          </h2>
          <div className="text-gray-700 space-y-1">
            <p className="font-semibold">{orderData.shippingInfo.fullName}</p>
            <p>{orderData.shippingInfo.address}</p>
            <p>{orderData.shippingInfo.city}, {orderData.shippingInfo.state} {orderData.shippingInfo.zipCode}</p>
            <p>{orderData.shippingInfo.country}</p>
            <p className="pt-2">
              <span className="text-gray-600">Email:</span> {orderData.shippingInfo.email}
            </p>
            <p>
              <span className="text-gray-600">Phone:</span> {orderData.shippingInfo.phone}
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <p className="text-gray-700 capitalize">{orderData.paymentMethod.replace('_', ' ')}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="flex-1 bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200">
            Continue Shopping
          </Link>
          <Link to={`/order-tracking/${orderData.orderId}`} className="flex-1 bg-white border-2 border-green-600 text-green-600 text-center py-3 rounded-lg font-semibold hover:bg-green-50 transition duration-200">
            Track Order
          </Link>
        </div>

        {/* Confirmation Email Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            📧 A confirmation email has been sent to <strong>{orderData.shippingInfo.email}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
