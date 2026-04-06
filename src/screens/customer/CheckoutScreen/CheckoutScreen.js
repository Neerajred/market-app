import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaUser, FaPhone, FaPlus, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import { calculateTotal } from '../../../utils/helpers';
import { useToast } from '../../Toast/ToastProvider';
import { addressAPI } from '../../../services/api';

const Checkout = ({ cart }) => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isChanging, setIsChanging] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      addToast('Please login to proceed with checkout', 'info');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    const loadData = async () => {
      try {
        const res = await addressAPI.getAddresses();
        const savedAddresses = res.addresses || [];
        setAddresses(savedAddresses);

        // Find default address
        const defaultAddr = savedAddresses.find(a => a.isDefault);
        if (defaultAddr) {
          selectAddress(defaultAddr);
        } else if (savedAddresses.length > 0) {
          selectAddress(savedAddresses[0]);
        } else {
          setIsAdding(true);
        }
      } catch (err) {
        console.error('Failed to load addresses:', err);
        setIsAdding(true);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cart, navigate, addToast]);

  const selectAddress = (addr) => {
    setFormData({
      fullName: addr.name || '',
      email: '', // Backend might not store email in address, we'll try to get it if possible
      phone: addr.mobile || '',
      address: addr.addressLine1 || '',
      city: addr.city || '',
      state: addr.state || '',
      zipCode: addr.postalCode || '',
      country: 'India',
    });
    setIsChanging(false);
    setIsAdding(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.match(/^\d{10}/)) newErrors.phone = 'Valid 10-digit phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Valid zip code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const payload = {
          name: formData.fullName,
          mobile: formData.phone,
          addressLine1: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.zipCode,
          country: 'India',
          isDefault: addresses.length === 0
        };
        const res = await addressAPI.addAddress(payload);
        if (res.success) {
          setAddresses([...addresses, res.address]);
          selectAddress(res.address);
          addToast('Address added successfully', 'success');
        }
      } catch (err) {
        addToast('Failed to save address', 'error');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      localStorage.setItem('shippingInfo', JSON.stringify(formData));
      navigate('/payment');
    }
  };

  const total = calculateTotal(cart);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/cart" className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold mb-6">
          <FaArrowLeft /> Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Delivery Address</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Select your preferred shipping location</p>
                </div>
                {!isAdding && (
                  <button 
                    onClick={() => setIsChanging(!isChanging)}
                    className="text-[11px] font-black uppercase tracking-widest text-green-600 hover:text-green-700 bg-green-50 px-4 py-2 rounded-xl transition-colors"
                  >
                    {isChanging ? 'Cancel' : 'Change'}
                  </button>
                )}
              </div>

              {isAdding ? (
                <form onSubmit={handleAddNew} className="space-y-6 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} icon={FaUser} placeholder="Enter your name" />
                    <FormField label="Mobile Number" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} icon={FaPhone} placeholder="10-digit mobile number" />
                  </div>
                  <FormField label="Street Address" name="address" value={formData.address} onChange={handleChange} error={errors.address} icon={FaMapMarkerAlt} placeholder="Building name, street, area" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FormField label="City" name="city" value={formData.city} onChange={handleChange} error={errors.city} placeholder="e.g. Mumbai" />
                    <FormField label="State" name="state" value={formData.state} onChange={handleChange} error={errors.state} placeholder="e.g. Maharashtra" />
                    <FormField label="Zip Code" name="zipCode" value={formData.zipCode} onChange={handleChange} error={errors.zipCode} placeholder="6-digit PIN" />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-green-600 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-green-700 transition-all shadow-lg shadow-green-100 transform active:scale-95">
                      Save & Continue
                    </button>
                    {addresses.length > 0 && (
                      <button type="button" onClick={() => { setIsAdding(false); setIsChanging(true); }} className="px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs text-gray-400 hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              ) : isChanging ? (
                <div className="space-y-4 animate-fadeIn">
                  {addresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => selectAddress(addr)}
                      className="group relative bg-gray-50 border-2 border-transparent hover:border-green-200 rounded-3xl p-5 cursor-pointer transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm border border-gray-100">
                            <FaMapMarkerAlt size={16} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-black text-gray-800 text-sm uppercase tracking-tight">{addr.name}</span>
                              {addr.isDefault && <span className="text-[9px] font-black uppercase tracking-widest bg-green-100 text-green-700 px-2 py-0.5 rounded-md">Default</span>}
                            </div>
                            <p className="text-[11px] font-bold text-gray-500 leading-relaxed mb-1">{addr.addressLine1}</p>
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{addr.city}, {addr.state} - {addr.postalCode}</p>
                            <p className="text-[11px] font-black text-gray-700 mt-2 flex items-center gap-2">
                              <FaPhone size={10} className="text-gray-400" /> +91 {addr.mobile}
                            </p>
                          </div>
                        </div>
                        <FaChevronRight className="text-gray-200 group-hover:text-green-500 transition-colors mt-2" size={14} />
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full flex items-center justify-center gap-3 py-6 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-black uppercase tracking-widest text-[11px] hover:bg-white hover:border-green-400 hover:text-green-600 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                      <FaPlus size={14} />
                    </div>
                    Add New Address
                  </button>
                </div>
              ) : (
                <div className="bg-green-50/50 border-2 border-green-100 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <FaCheckCircle size={100} className="text-green-600" />
                  </div>
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                      <FaMapMarkerAlt size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 text-base uppercase tracking-tight mb-1">{formData.fullName}</h4>
                      <p className="text-[12px] font-bold text-gray-600 leading-relaxed mb-1">{formData.address}</p>
                      <p className="text-[12px] font-bold text-gray-600 uppercase tracking-wide border-b border-green-100 pb-3 mb-3">{formData.city}, {formData.state} - {formData.zipCode}</p>
                      <p className="text-xs font-black text-gray-800 flex items-center gap-2">
                        <FaPhone className="text-green-600" /> +91 {formData.phone}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSubmit}
                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs mt-8 hover:bg-green-700 transition-all shadow-lg shadow-green-100 transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <FaChevronRight size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-4 border border-gray-100">
              <h3 className="text-xl font-black text-gray-800 mb-8 uppercase tracking-tight">Order Summary</h3>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 custom-scrollbar pr-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-b-0">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-xs text-gray-800 truncate uppercase tracking-tight">{item.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">Qty: {item.quantity}</p>
                      <p className="text-xs font-black text-green-600 mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-gray-800">₹{total}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Tax (8%)</span>
                  <span className="text-gray-800">₹{(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-4 border-t border-gray-100 mt-4">
                  <span className="text-gray-800 uppercase tracking-tight">Total</span>
                  <span className="text-green-600">₹{(parseFloat(total) + parseFloat(total) * 0.08).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FormField = ({ label, name, value, onChange, error, icon: Icon, placeholder }) => (
  <div className="flex-1">
    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
      {Icon && <Icon className="inline mr-2 text-green-600" size={12} />}{label}
    </label>
    <input
      type="text" name={name} value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-green-500 outline-none text-xs font-black transition-all ${error ? 'border-red-500' : 'border-transparent hover:border-gray-200'}`}
    />
    {error && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1 italic">{error}</p>}
  </div>
);

export default Checkout;
