/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser, FaEnvelope, FaPhone, FaBox, FaArrowLeft,
  FaCheckCircle, FaTruck, FaHourglass, FaMapMarkerAlt,
  FaSignOutAlt, FaHeart, FaPlus, FaTrash, FaSync
} from 'react-icons/fa';
import { profileAPI, orderAPI, addressAPI, authAPI } from '../../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    mobile: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    isDefault: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Profile
      try {
        const profileData = await profileAPI.getProfile();
        if (profileData.success) {
          setProfile(profileData.user);
        }
      } catch (err) {
        // Fallback to local storage if API fails (or offline)
        const username = localStorage.getItem('username');
        const userProfile = localStorage.getItem('userProfile');
        if (userProfile) {
          const parsed = JSON.parse(userProfile);
          setProfile({ name: username, fullname: parsed.fullName, email: parsed.email, mobile: parsed.phone });
        } else {
          setProfile({ name: username, fullname: username });
        }
      }

      // 2. Fetch Orders
      try {
        const ordersData = await orderAPI.getOrders();
        if (ordersData.success) {
          setOrders(ordersData.orders);
        }
      } catch (err) {
        // Fallback to local storage
        const userId = localStorage.getItem('userId');
        if (userId) {
          const localOrders = JSON.parse(localStorage.getItem(`orders_${userId}`) || '[]');
          setOrders(localOrders);
        }
      }

      // 3. Fetch Addresses
      try {
        const addressData = await addressAPI.getAddresses();
        if (addressData.success) {
          setAddresses(addressData.addresses);
        }
      } catch (err) {
        console.error("Failed to fetch addresses", err);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout failed", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("userProfile");
    navigate('/');
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(newAddress.mobile)) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }
    if (!newAddress.name || !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.postalCode) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        ...newAddress,
        country: newAddress.country || 'USA', // Ensure country is sent
        mobile: String(newAddress.mobile) // Ensure string format
      };
      await addressAPI.addAddress(payload);
      setShowAddressForm(false);
      setNewAddress({
        name: '', mobile: '', addressLine1: '', city: '', state: '', postalCode: '', country: 'USA', isDefault: false
      });
      fetchData(); // Refresh addresses
    } catch (err) {
      console.error("Address add failed", err);
      const msg = err.response?.data?.message || 'Failed to add address. Please check your inputs.';
      alert(msg);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await addressAPI.deleteAddress(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete address.');
    }
  };

  // --- Render Helpers ---

  const getStatusIcon = (status) => {
    const s = (status || 'confirmed').toLowerCase();
    if (s === 'delivered') return <FaCheckCircle className="text-green-600" />;
    if (s === 'shipped') return <FaTruck className="text-blue-600" />;
    return <FaHourglass className="text-yellow-600" />;
  };

  const getStatusColor = (status) => {
    const s = (status || 'confirmed').toLowerCase();
    if (s === 'delivered') return 'bg-green-100 text-green-800';
    if (s === 'shipped') return 'bg-blue-100 text-blue-800';
    if (s === 'cancelled') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const SidebarItem = ({ id, icon: Icon, label, onClick, isLink, to }) => {
    const active = activeTab === id;
    const baseClass = `flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium whitespace-nowrap ${active
      ? 'bg-primary-50 text-primary-700 shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`;

    if (isLink) {
      return (
        <Link to={to} className={baseClass}>
          <Icon className={active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} />
          {label}
        </Link>
      );
    }

    return (
      <button onClick={onClick} className={baseClass}>
        <Icon className={active ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-600'} />
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-6 transition-colors font-medium">
          <FaArrowLeft /> Back to Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 h-fit">
            {/* User Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl font-bold">
                {profile?.fullname?.charAt(0) || profile?.name?.charAt(0) || <FaUser />}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm text-slate-500">Hello,</p>
                <h2 className="text-lg font-bold text-slate-900 truncate">{profile?.fullname || profile?.name || 'User'}</h2>
              </div>
            </div>

            {/* Navigation Menu */}
            {/* Navigation Menu */}
            <nav className="bg-white p-2 lg:p-4 rounded-2xl shadow-sm border border-slate-100 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:gap-1 no-scrollbar mb-6 lg:mb-0">
              <SidebarItem id="profile" icon={FaUser} label="My Profile" onClick={() => setActiveTab('profile')} />
              <SidebarItem id="orders" icon={FaBox} label="My Orders" onClick={() => setActiveTab('orders')} />
              <SidebarItem id="addresses" icon={FaMapMarkerAlt} label="Addresses" onClick={() => setActiveTab('addresses')} />
              <SidebarItem id="wishlist" icon={FaHeart} label="My Wishlist" isLink to="/wishlist" />
              <div className="hidden lg:block my-2 border-t border-slate-100"></div>
              <div className="lg:hidden w-px bg-slate-100 mx-1"></div>
              <button
                onClick={handleLogout}
                className="flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 font-medium whitespace-nowrap"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-500">Full Name</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-900 font-medium">
                      {profile?.fullname || profile?.name || 'Not provided'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-500">Email Address</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-900 font-medium">
                      {profile?.email || 'Not provided'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-500">Mobile Number</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-900 font-medium">
                      {profile?.mobile || 'Not provided'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-500">Account ID</label>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-900 font-medium">
                      #{profile?._id || 'N/A'}
                    </div>
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <button className="text-primary-600 font-semibold hover:underline cursor-not-allowed opacity-50" title="Edit Disabled">
                      Edit Information
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">My Orders</h2>
                  <button onClick={fetchData} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                    <FaSync />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaBox className="text-slate-300 text-3xl" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No orders yet</h3>
                    <p className="text-slate-500 mb-6">Looks like you haven't placed any orders yet.</p>
                    <Link to="/" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...orders].reverse().map(order => (
                      <div key={order.orderId || order._id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-lg">Order #{order.orderId || order._id}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                {order.status || 'Confirmed'}
                              </span>
                            </div>
                            <p className="text-slate-500 text-sm">Placed on {new Date(order.orderDate || order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Link to={`/order-tracking/${order.orderId || order._id}`} className="bg-slate-900 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors text-center">
                            Track Order
                          </Link>
                        </div>
                        <div className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
                          {(order.items || []).slice(0, 4).map((item, idx) => (
                            <div key={idx} className="flex-shrink-0 w-16 h-16 bg-slate-50 rounded-lg border border-slate-100 p-1">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300"><FaBox /></div>
                              )}
                            </div>
                          ))}
                          {(order.items || []).length > 4 && (
                            <div className="flex-shrink-0 w-16 h-16 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 -mx-6 -mb-6 px-6 py-4 rounded-b-2xl">
                          <span className="text-slate-600 font-medium">Total Amount</span>
                          <span className="text-xl font-bold text-primary-700">${order.total || order.totalPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Manage Addresses</h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-primary-600 transition-colors flex items-center gap-2"
                  >
                    <FaPlus /> Add New Address
                  </button>
                </div>

                {showAddressForm && (
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-fadeIn">
                    <h3 className="font-bold text-lg mb-4">Add New Address</h3>
                    <form onSubmit={handleAddressSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input required placeholder="Full Name" className="p-3 bg-slate-50 rounded-xl border-slate-200" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} />
                      <input required placeholder="Mobile Number" className="p-3 bg-slate-50 rounded-xl border-slate-200" value={newAddress.mobile} onChange={e => setNewAddress({ ...newAddress, mobile: e.target.value })} />
                      <input required placeholder="Address Line 1" className="p-3 bg-slate-50 rounded-xl border-slate-200 md:col-span-2" value={newAddress.addressLine1} onChange={e => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
                      <input required placeholder="City" className="p-3 bg-slate-50 rounded-xl border-slate-200" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                      <input required placeholder="State" className="p-3 bg-slate-50 rounded-xl border-slate-200" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
                      <input required placeholder="Postal Code" className="p-3 bg-slate-50 rounded-xl border-slate-200" value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })} />

                      <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                        <button type="button" onClick={() => setShowAddressForm(false)} className="px-5 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancel</button>
                        <button type="submit" className="px-5 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700">Save Address</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-primary-200 transition-colors relative group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                          {addr.label || 'Home'}
                        </div>
                        <button onClick={() => handleDeleteAddress(addr._id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                          <FaTrash />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">{addr.name}</h4>
                      <p className="text-slate-600 text-sm mb-1">{addr.addressLine1}</p>
                      <p className="text-slate-600 text-sm">{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p className="text-slate-500 text-sm mt-2 pt-2 border-t border-slate-50 flex items-center gap-2">
                        <FaPhone className="text-xs" /> {addr.mobile}
                      </p>
                    </div>
                  ))}
                  {!showAddressForm && addresses.length === 0 && (
                    <div className="md:col-span-2 text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-100 border-dashed">
                      No addresses found. Add one to speed up checkout!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
