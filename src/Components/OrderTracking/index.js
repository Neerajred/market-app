import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaBox, FaCheck, FaTruck, FaHome, FaArrowLeft } from 'react-icons/fa';

import { orderAPI } from '../../services/api';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Try fetching from backend first
        const response = await orderAPI.getOrderById(orderId);
        if (response.success) {
          setOrderData(response.order);
        } else {
          throw new Error("Order not found");
        }
      } catch (err) {
        console.log("Fetching from API failed, trying local storage...");
        // Fallback to local storage (legacy or just-placed order)
        const lastOrder = localStorage.getItem('lastOrder');
        if (lastOrder) {
          const order = JSON.parse(lastOrder);
          // Loose comparison for ID safety
          if (String(order.orderId) === String(orderId) || String(order._id) === String(orderId)) {
            setOrderData(order);
          } else {
            // If neither API nor local storage has it, redirect
            navigate('/');
          }
        } else {
          navigate('/');
        }
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const orderSteps = [
    { id: 1, name: 'Order Confirmed', icon: FaCheck, status: 'completed', date: new Date(orderData.orderDate).toLocaleDateString() },
    { id: 2, name: 'Processing', icon: FaBox, status: 'completed', date: new Date(orderData.orderDate).toLocaleDateString() },
    { id: 3, name: 'Shipped', icon: FaTruck, status: 'current', date: 'Expected in 2-3 days' },
    { id: 4, name: 'Delivered', icon: FaHome, status: 'pending', date: 'Pending' },
  ];

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-primary-600 text-white';
      case 'current':
        return 'bg-primary-500 text-white';
      default:
        return 'bg-slate-300 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 font-semibold mb-6">
          <FaArrowLeft /> Back to Home
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-slate-600">Order ID: <span className="font-semibold text-primary-700">{orderData.orderId}</span></p>
          <p className="text-sm text-slate-500 mt-1">Placed on {new Date(orderData.orderDate).toLocaleString()}</p>
        </div>

        {/* Order Progress */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 mb-6">
          <h2 className="text-xl font-bold mb-8">Order Status</h2>

          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-slate-300" style={{ width: 'calc(100% - 80px)', left: '40px' }}></div>
              <div className="absolute top-12 left-0 h-1 bg-primary-600" style={{ width: 'calc(50% - 40px)', left: '40px' }}></div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {orderSteps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center" style={{ width: '80px' }}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${getStepColor(step.status)} shadow-lg transition-all duration-300`}>
                      <step.icon className="text-2xl" />
                    </div>
                    <p className="text-sm font-semibold text-center mb-1">{step.name}</p>
                    <p className="text-xs text-slate-500 text-center">{step.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {orderSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepColor(step.status)} shadow-lg`}>
                    <step.icon className="text-lg" />
                  </div>
                  {index < orderSteps.length - 1 && (
                    <div className={`w-1 h-12 mt-2 ${step.status === 'completed' ? 'bg-primary-600' : 'bg-slate-300'}`}></div>
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <p className="font-semibold">{step.name}</p>
                  <p className="text-sm text-slate-500">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="space-y-3">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-xl font-bold text-primary-600">${orderData.total}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
          <div className="text-slate-700 space-y-1">
            <p className="font-semibold">{orderData.shippingInfo.fullName}</p>
            <p>{orderData.shippingInfo.address}</p>
            <p>{orderData.shippingInfo.city}, {orderData.shippingInfo.state} {orderData.shippingInfo.zipCode}</p>
            <p className="pt-2">📞 {orderData.shippingInfo.phone}</p>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 sm:p-6 text-center">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-slate-700 mb-4">
            If you have any questions about your order, please contact our customer support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:support@freshmart.com" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition duration-200">
              Email Support
            </a>
            <a href="tel:+1234567890" className="bg-white border-2 border-primary-600 text-primary-600 px-6 py-2 rounded-lg hover:bg-primary-50 transition duration-200">
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
