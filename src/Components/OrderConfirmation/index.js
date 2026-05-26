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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

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
                backgroundColor: ['#6366f1', '#4338ca', '#818cf8', '#c7d2fe'][Math.floor(Math.random() * 4)]
              }}
            />
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Success Message */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-12 text-center mb-8 animate-slide-up">
          {/* Success Check Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-primary-50 p-4 rounded-full">
                <FaCheckCircle className="text-primary-600 text-6xl shadow-sm" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 mb-4 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
            Thank you for your purchase. We've received your order and are getting it ready.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 inline-flex flex-col items-center min-w-[200px]">
            <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">Order ID</p>
            <p className="text-xl font-mono font-bold text-slate-900">{orderData.orderId}</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold font-heading text-slate-900 mb-6 flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
              <FaBox />
            </div>
            Order Details
          </h2>

          <div className="space-y-4">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors rounded-lg px-2 -mx-2">
                <div className="h-16 w-16 bg-slate-50 rounded-lg p-2 border border-slate-100 flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-base truncate">{item.name}</p>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-xs text-slate-400">${item.price} ea</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold">${(parseFloat(orderData.total) / 1.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax (8%)</span>
              <span className="font-semibold">${(parseFloat(orderData.total) - parseFloat(orderData.total) / 1.08).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-900 pt-4 border-t border-slate-100 mt-2">
              <span>Total Paid</span>
              <span className="text-primary-600">${orderData.total}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-bold font-heading text-slate-900 mb-4 flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <FaMapMarkerAlt />
              </div>
              Shipping Address
            </h2>
            <div className="text-slate-600 space-y-1.5 text-sm leading-relaxed">
              <p className="font-bold text-slate-900 text-base">{orderData.shippingInfo.fullName}</p>
              <p>{orderData.shippingInfo.address}</p>
              <p>{orderData.shippingInfo.city}, {orderData.shippingInfo.state} {orderData.shippingInfo.zipCode}</p>
              <p className="text-slate-400 uppercase text-xs font-bold pt-1">{orderData.shippingInfo.country}</p>
              <div className="pt-3 border-t border-slate-50 mt-3">
                <p className="flex items-center gap-2"><span className="text-slate-400">Email:</span> {orderData.shippingInfo.email}</p>
                <p className="flex items-center gap-2"><span className="text-slate-400">Phone:</span> {orderData.shippingInfo.phone}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold font-heading text-slate-900 mb-4">Payment Method</h3>
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4">
              <div className="capitalize font-bold text-slate-900 text-lg">
                {orderData.paymentMethod.replace('_', ' ')}
              </div>
            </div>
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-700 leading-relaxed">
                <span className="text-xl mr-2">📧</span>
                A confirmation email has been sent to <strong>{orderData.shippingInfo.email}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="flex-1 bg-slate-900 text-white text-center py-4 rounded-xl font-bold hover:bg-primary-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Continue Shopping
          </Link>
          <Link to={`/order-tracking/${orderData.orderId}`} className="flex-1 bg-white border-2 border-slate-200 text-slate-700 text-center py-4 rounded-xl font-bold hover:border-primary-600 hover:text-primary-600 transition-all duration-300">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
