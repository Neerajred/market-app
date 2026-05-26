import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { calculateTotal } from '../../utils/helpers';

const Checkout = ({ cart }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    // Check if user is logged in
    if (token && username) {

      // Try to get stored shipping info first
      const savedShipping = localStorage.getItem('shippingInfo');
      if (savedShipping) {
        setFormData(JSON.parse(savedShipping));
      } else {
        // If no saved shipping, auto-fill with user profile data
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          const profile = JSON.parse(userProfile);
          setFormData(prev => ({
            ...prev,
            fullName: profile.fullName || '',
            email: profile.email || '',
            phone: profile.phone || '',
          }));
        }
      }
    } else {
      // Not logged in, redirect to login
      alert('Please login to proceed with checkout');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email is required';
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Valid 10-digit phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.match(/^\d{5,6}$/)) newErrors.zipCode = 'Valid zip code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Store shipping info in localStorage for payment page
      localStorage.setItem('shippingInfo', JSON.stringify(formData));
      navigate('/payment');
    }
  };

  const total = calculateTotal(cart);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/cart" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold mb-6 transition-colors font-heading text-sm">
          <FaArrowLeft /> Back to Cart
        </Link>

        <h1 className="text-3xl font-bold font-heading text-slate-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold font-heading text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">1</span>
                Shipping Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaUser className="inline mr-2 text-slate-400" />Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.fullName ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <FaEnvelope className="inline mr-2 text-slate-400" />Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      <FaPhone className="inline mr-2 text-slate-400" />Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                      placeholder="1234567890"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-slate-400" />Street Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.address ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>}
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.city ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                      placeholder="New York"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.state ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                      placeholder="NY"
                    />
                    {errors.state && <p className="text-red-500 text-xs mt-1 font-medium">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${errors.zipCode ? 'border-red-300 focus:ring-red-200' : 'border-slate-200'}`}
                      placeholder="10001"
                    />
                    {errors.zipCode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.zipCode}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-primary-600 transition-all duration-300 mt-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
              <h3 className="text-lg font-bold font-heading text-slate-900 mb-6">Order Summary</h3>

              <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar mb-6 pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                    <div className="w-16 h-16 bg-slate-50 rounded-lg p-2 flex-shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-slate-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${total}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className="text-primary-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Tax (8%)</span>
                  <span className="font-medium">${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-slate-900 pt-4 border-t border-slate-100 mt-2">
                  <span>Total</span>
                  <span>${(parseFloat(total) + parseFloat(total) * 0.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
