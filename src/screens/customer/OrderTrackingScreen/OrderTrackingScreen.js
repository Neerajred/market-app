import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaBox, FaCheck, FaTruck, FaHome, FaArrowLeft } from 'react-icons/fa';
import { orderAPI } from '../../../services/api';
import { useConfirmation } from '../../Modal/ConfirmationProvider';

const OrderTracking = () => {
  const { askConfirm } = useConfirmation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getOrderById(orderId);
        if (res.success) {
          const order = res.order;
          setOrderData({
            orderId: order.id,
            orderDate: order.createdAt,
            items: order.items.map(i => ({
              ...i.product,
              quantity: i.quantity,
              price: i.price
            })),
            shippingInfo: {
              fullName: order.shippingAddress.name,
              address: order.shippingAddress.addressLine1,
              city: order.shippingAddress.city,
              state: order.shippingAddress.state,
              zipCode: order.shippingAddress.postalCode,
              phone: order.shippingAddress.mobile
            },
            total: order.totalPrice,
            status: order.status
          });
        } else {
          navigate('/orders');
        }
      } catch (err) {
        console.error('Error fetching order tracking:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
      // Set up polling for "real time" updates every 30s
      const pollInterval = setInterval(fetchOrder, 30000);
      return () => clearInterval(pollInterval);
    }
  }, [orderId, navigate]);

  if (loading || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const handleCancelOrder = () => {
    askConfirm({
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const res = await orderAPI.cancelOrder(orderId);
          if (res.success) {
            setOrderData(prev => ({ ...prev, status: 'cancelled' }));
          }
        } catch (err) {
          console.error('Failed to cancel order:', err);
        }
      }
    });
  };

  const currentStatus = (orderData.status || 'processing').toLowerCase();
  
  const getStatusInfo = (stepId) => {
    if (currentStatus === 'cancelled') return 'cancelled';
    
    const statusMap = {
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4
    };
    const currentStep = statusMap[currentStatus] || 2; // Default to processing as per backend
    
    if (currentStatus === 'delivered') return 'completed';
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const orderSteps = [
    { id: 1, name: 'Order Confirmed', icon: FaCheck, status: getStatusInfo(1), date: new Date(orderData.orderDate).toLocaleDateString() },
    { id: 2, name: 'Processing', icon: FaBox, status: getStatusInfo(2), date: getStatusInfo(2) === 'completed' ? new Date(orderData.orderDate).toLocaleDateString() : 'Active' },
    { id: 3, name: 'Shipped', icon: FaTruck, status: getStatusInfo(3), date: getStatusInfo(3) === 'completed' ? 'In Transit' : getStatusInfo(3) === 'current' ? 'On its way' : 'Pending' },
    { id: 4, name: 'Delivered', icon: FaHome, status: getStatusInfo(4), date: getStatusInfo(4) === 'completed' ? 'Delivered' : 'Pending' },
  ];

  const getStepColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'current': return 'bg-blue-600 text-white';
      case 'cancelled': return 'bg-red-50 text-red-200';
      default: return 'bg-gray-100 text-gray-400';
    }
  };

  // Calculate progress bar width based on current status
  const getProgressWidth = () => {
    const statusMap = { 'confirmed': 0, 'processing': 33, 'shipped': 66, 'delivered': 100 };
    return `${statusMap[currentStatus] || 0}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold mb-6">
          <FaArrowLeft /> Back to Home
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black text-gray-800 mb-2 uppercase tracking-tight">Track Your Order</h1>
              <div className="flex items-center gap-3">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest opacity-80">Order ID: <span className="text-green-700 font-black">#{orderData.orderId.split('-')[0]}</span></p>
                {currentStatus === 'cancelled' && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-red-200">Cancelled</span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-1 font-bold">Placed on {new Date(orderData.orderDate).toLocaleString()}</p>
            </div>
            {(currentStatus === 'processing' || currentStatus === 'confirmed') && (
              <button 
                onClick={handleCancelOrder}
                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-red-100 active:scale-95"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Order Progress */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 mb-6">
          <h2 className="text-lg font-black text-gray-800 mb-8 uppercase tracking-tight">Order Status</h2>
          
          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-10 left-0 right-0 h-1 bg-gray-200" style={{ width: 'calc(100% - 80px)', left: '40px' }}></div>
              <div className="absolute top-10 left-0 h-1 bg-green-600 transition-all duration-700" style={{ width: `calc(${getProgressWidth()} - 40px)`, left: '40px' }}></div>
              
              {/* Steps */}
              <div className="relative flex justify-between">
                {orderSteps.map((step) => (
                  <div key={step.id} className="flex flex-col items-center" style={{ width: '80px' }}>
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${getStepColor(step.status)} shadow-lg transition-all duration-500 hover:scale-105 active:scale-95`}>
                      <step.icon className="text-2xl" />
                    </div>
                    <p className="text-sm font-semibold text-center mb-1">{step.name}</p>
                    <p className="text-xs text-gray-500 text-center">{step.date}</p>
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
                    <div className={`w-1 h-12 mt-2 ${step.status === 'completed' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <p className="font-semibold">{step.name}</p>
                  <p className="text-sm text-gray-500">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-black text-gray-800 mb-4 uppercase tracking-tight">Order Items</h2>
          <div className="space-y-3">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 pb-3 border-b last:border-b-0">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs text-gray-800 truncate">{item.name}</p>
                  <p className="text-[10px] font-bold text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <p className="font-black text-xs text-gray-900">{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-base font-black text-gray-800 uppercase tracking-tight">Total</span>
            <span className="text-xl font-black text-green-600">₹{orderData.total}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-black text-gray-800 mb-4 uppercase tracking-tight">Delivery Address</h2>
          <div className="text-gray-700 space-y-1">
            <p className="text-xs font-black text-gray-800">{orderData.shippingInfo.fullName}</p>
            <p className="text-xs font-bold text-gray-500">{orderData.shippingInfo.address}</p>
            <p className="text-xs font-bold text-gray-500">{orderData.shippingInfo.city}, {orderData.shippingInfo.state} {orderData.shippingInfo.zipCode}</p>
            <p className="pt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">📞 {orderData.shippingInfo.phone}</p>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-gray-700 mb-4">
            If you have any questions about your order, please contact our customer support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:support@freshmart.com" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
              Email Support
            </a>
            <a href="tel:+1234567890" className="bg-white border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition duration-200">
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
