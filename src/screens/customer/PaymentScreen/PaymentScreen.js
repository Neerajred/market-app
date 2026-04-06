import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCreditCard, FaLock } from 'react-icons/fa';
import { PAYMENT_METHODS } from '../../../utils/constants';
import { calculateTotal } from '../../../utils/helpers';
import { useToast } from '../../Toast/ToastProvider';
import { orderAPI } from '../../../services/api';

const Payment = ({ cart, setCart, isLoggedIn }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('credit_card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const shippingInfo = localStorage.getItem('shippingInfo');
    
    if (!token || !isLoggedIn) {
      addToast('Please login to place an order', 'info');
      navigate('/login');
      return;
    }
    
    if (!shippingInfo || cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate, isLoggedIn, addToast]);

  const validateCardDetails = () => {
    const newErrors = {};
    
    if (selectedMethod === 'credit_card' || selectedMethod === 'debit_card') {
      if (!cardDetails.cardNumber.match(/^\d{16}/)) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      if (!cardDetails.cardName.trim()) {
        newErrors.cardName = 'Cardholder name is required';
      }
      if (!cardDetails.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}/)) {
        newErrors.expiryDate = 'Valid expiry date (MM/YY) is required';
      }
      if (!cardDetails.cvv.match(/^\d{3,4}/)) {
        newErrors.cvv = 'CVV must be 3 or 4 digits';
      }
    } else if (selectedMethod === 'upi') {
      if (!upiId.match(/^[\w.-]+@[\w.-]+/)) {
        newErrors.upiId = 'Valid UPI ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (selectedMethod !== 'cod' && !validateCardDetails()) {
      return;
    }

    setIsProcessing(true);

    try {
      const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo'));
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      
      if (!userId) {
        addToast('User session expired. Please login again.', 'warning');
        navigate('/login');
        return;
      }
      
      const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const totalAmount = (parseFloat(calculateTotal(cart)) + parseFloat(calculateTotal(cart)) * 0.08).toFixed(2);
      
      const orderData = {
        orderId,
        userId,
        username,
        items: cart,
        shippingInfo,
        paymentMethod: selectedMethod,
        total: totalAmount,
        orderDate: new Date().toISOString(),
        status: 'confirmed',
      };

      // Store order with user-specific key
      const userOrdersKey = `orders_${userId}`;
      const existingOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
      existingOrders.push(orderData);
      localStorage.setItem(userOrdersKey, JSON.stringify(existingOrders));
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      
      console.log('Order saved successfully for user:', userId);
      console.log('Order data:', orderData);
      console.log('Total orders for this user:', existingOrders.length);

      // Sync order to backend
      if (token) {
        try {
          console.log('Syncing order to backend...');
          const response = await orderAPI.createOrder(orderData);
          if (response.success) {
             addToast('Order placed successfully!', 'success');
             // Optionally update the local order with backend-generated ID
             orderData.id = response.order.id;
             localStorage.setItem('lastOrder', JSON.stringify(orderData));
          }
        } catch (backendError) {
          console.error('Backend sync failed:', backendError);
          // We still continue because we saved it locally, but inform the console
        }
      }
      
      // Clear cart and shipping info
      setCart([]);
      localStorage.removeItem('shippingInfo');
      
      setIsProcessing(false);
      navigate('/order-confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ submit: 'Payment failed. Please try again.' });
      setIsProcessing(false);
    }
  };

  const total = calculateTotal(cart);
  const tax = (total * 0.08).toFixed(2);
  const grandTotal = (parseFloat(total) + parseFloat(tax)).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/checkout" className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold mb-6">
          <FaArrowLeft /> Back to Checkout
        </Link>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <FaLock className="text-green-600" />
            <h2 className="text-2xl font-bold">Secure Payment</h2>
          </div>

          <form onSubmit={handlePayment}>
            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border-2 rounded-lg text-center transition duration-200 ${
                      selectedMethod === method.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    <div className="text-3xl mb-2">{method.icon}</div>
                    <p className="text-sm font-medium">{method.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Details Form */}
            {(selectedMethod === 'credit_card' || selectedMethod === 'debit_card') && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaCreditCard className="inline mr-2" />Card Number
                  </label>
                  <input
                    type="text"
                    maxLength="16"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value.replace(/\D/g, '') })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="1234 5678 9012 3456"
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardDetails.cardName}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="JOHN DOE"
                  />
                  {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      maxLength="5"
                      value={cardDetails.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + '/' + value.slice(2, 4);
                        }
                        setCardDetails({ ...cardDetails, expiryDate: value });
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="MM/YY"
                    />
                    {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength="4"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '') })}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="123"
                    />
                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* UPI Form */}
            {selectedMethod === 'upi' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.upiId ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="yourname@upi"
                />
                {errors.upiId && <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>}
              </div>
            )}

            {/* COD Message */}
            {selectedMethod === 'cod' && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Cash on Delivery:</strong> You will pay {grandTotal} in cash when your order is delivered.
                </p>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%)</span>
                  <span>${tax}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${grandTotal}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200 ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Payment...
                </span>
              ) : (
                `Pay ${grandTotal}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
