import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, CreditCard, 
  Camera, Plus, CheckCircle, 
  AlertCircle, Save
} from 'lucide-react';
import { profileAPI, addressAPI } from '../../../services/api';
import { useToast } from '../../Toast/ToastProvider';
import EmptyState from '../EmptyState/EmptyState';

const ProfilePage = () => {
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ fullname: '', email: '', mobile: '' });
  const [addresses, setAddresses] = useState([]);
  const [cards, setCards] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: '', mobile: '', addressLine1: '', city: '', state: '', postalCode: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      // Parallel fetch with error handling for each to avoid complete failure
      const [profData, addrData] = await Promise.allSettled([
        profileAPI.getProfile(),
        addressAPI.getAddresses()
      ]);

      if (profData.status === 'fulfilled' && profData.value.success) {
        setProfile({
          fullname: profData.value.user.fullname || '',
          name: profData.value.user.name || '',
          email: profData.value.user.email || '',
          mobile: profData.value.user.mobile || '',
          profileImg: profData.value.user.profileImg
        });
        setCards(profData.value.user.cards || []);
      } else {
         console.error('Profile fetch failed:', profData.reason);
      }

      if (addrData.status === 'fulfilled' && addrData.value.success) {
        setAddresses(addrData.value.addresses || []);
      } else {
         console.error('Address fetch failed:', addrData.reason);
      }
      
    } catch (error) {
      console.error('Data sync failed completely:', error);
      setMessage({ text: 'Cloud sync interrupted.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await addressAPI.setDefault(id);
      addToast('Default address updated!', 'success');
      fetchAllData();
    } catch (err) {
      addToast('Failed to update default address.', 'error');
    }
  };

  const handleSetDefaultCard = async (id) => {
    try {
      await profileAPI.setDefaultCard(id);
      addToast('Default payment card updated!', 'success');
      fetchAllData();
    } catch (err) {
      addToast('Failed to update default card.', 'error');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { fullname, mobile, name } = profile;
      const res = await profileAPI.updateProfile({ fullname: fullname || name, mobile });
      if (res.success) {
        setProfile(prev => ({ ...prev, ...res.user }));
        setMessage({ text: 'Updated successfully!', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Update failed.', type: 'error' });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressAPI.addAddress({ 
        ...addressForm, 
        country: 'India',
        isDefault: addresses.length === 0 
      });
      if (res.success) {
        addToast('Address added successfully!', 'success');
        setIsAddingAddress(false);
        setAddressForm({ name: '', mobile: '', addressLine1: '', city: '', state: '', postalCode: '' });
        fetchAllData();
      }
    } catch (err) { addToast('Failed to add address.', 'error'); }
  };

  const handleComingSoon = () => addToast('Card Payment feature coming soon!', 'info');

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
             <div className="w-12 h-12 border-4 border-green-100 rounded-full"></div>
             <div className="absolute top-0 w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">Syncing Account Data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'My Details', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'cards', label: 'Payment Methods', icon: CreditCard },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-full bg-gray-50 overflow-hidden relative">
      {message.text && (
        <div className={`absolute top-4 right-4 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideInRight ${
          message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span className="font-bold text-xs uppercase tracking-wider">{message.text}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-white border-r border-gray-100 flex flex-col pt-6 flex-shrink-0">
        <div className="px-6 mb-8 flex flex-col items-center lg:items-start">
          <div className="relative group mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-green-100 border-4 border-white">
              {profile?.profileImg ? (
                <img src={profile.profileImg} alt="" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                (profile?.fullname || profile?.name|| 'U').charAt(0)
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 bg-white p-2 rounded-xl shadow-lg text-green-600 border border-gray-100 hover:scale-110 transition-transform">
              <Camera size={14} />
            </button>
          </div>
          <h2 className="text-lg font-black text-gray-800 text-center lg:text-left truncate w-full">{profile?.fullname || profile?.name || 'User'}</h2>
          <p className="text-gray-400 text-[9px] font-bold uppercase tracking-widest truncate w-full">{profile?.email}</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-100 font-bold translate-x-1' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-gray-300'} />
                <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12">
        <div className="max-w-3xl mx-auto animate-fadeIn">
          
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <header>
                <h1 className="text-xl font-black text-gray-800 tracking-tight">Account Details</h1>
                <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest opacity-80">Update your profile and contact information.</p>
              </header>

              <form onSubmit={handleUpdateProfile} className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup 
                    icon={User} label="Full Name" 
                    value={profile?.fullname || ''} 
                    onChange={v => setProfile({...profile, fullname: v})} 
                  />
                  <InputGroup 
                    icon={Mail} label="Email Address" 
                    value={profile?.email || ''} readonly 
                  />
                  <InputGroup 
                    icon={Phone} label="Mobile Number" 
                    value={profile?.mobile || ''} 
                    onChange={v => setProfile({...profile, mobile: v})} 
                  />
                </div>
                <div className="pt-6 border-t border-gray-50 flex justify-end">
                  <button 
                    disabled={isUpdating}
                    className="group relative flex items-center justify-center gap-2 bg-green-600 text-white px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-green-700 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 shadow-lg shadow-green-100"
                  >
                    {isUpdating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} className="group-hover:scale-110 transition-transform" />}
                    Save Info
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-8">
               <div className="flex justify-between items-end">
                 <div>
                    <h1 className="text-xl font-black text-gray-800 tracking-tight">Saved Addresses</h1>
                    <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest opacity-80">Manage your delivery locations.</p>
                 </div>
                 <button onClick={() => setIsAddingAddress(true)} className="flex items-center gap-2 text-[11px] font-black uppercase bg-white border border-gray-100 px-5 py-3 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-700">
                    <Plus size={16} className="text-green-600" /> New Address
                 </button>
               </div>
               
               {isAddingAddress ? (
                 <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm animate-fadeIn">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">New Address</h3>
                     <button onClick={() => setIsAddingAddress(false)} className="text-[10px] font-black uppercase text-gray-400 hover:text-gray-600">Cancel</button>
                   </div>
                   <form onSubmit={handleAddAddress} className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup icon={User} label="Full Name" value={addressForm.name} onChange={v => setAddressForm({...addressForm, name: v})} />
                        <InputGroup icon={Phone} label="Mobile Number" value={addressForm.mobile} onChange={v => setAddressForm({...addressForm, mobile: v})} />
                     </div>
                     <InputGroup icon={MapPin} label="Street Address" value={addressForm.addressLine1} onChange={v => setAddressForm({...addressForm, addressLine1: v})} />
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputGroup icon={MapPin} label="City" value={addressForm.city} onChange={v => setAddressForm({...addressForm, city: v})} />
                        <InputGroup icon={MapPin} label="State" value={addressForm.state} onChange={v => setAddressForm({...addressForm, state: v})} />
                        <InputGroup icon={MapPin} label="PIN Code" value={addressForm.postalCode} onChange={v => setAddressForm({...addressForm, postalCode: v})} />
                     </div>
                     <div className="pt-6 flex justify-end">
                       <button className="bg-green-600 text-white px-10 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-green-700 shadow-lg shadow-green-100 transition-all">
                         Save Address
                       </button>
                     </div>
                   </form>
                 </div>
               ) : addresses.length === 0 ? (
                  <EmptyState 
                    icon={MapPin} 
                    title="No Addresses Found" 
                    subtitle="Looks like you haven't added any shipping addresses yet." 
                    buttonText="Manage Addresses"
                    accentColor="green"
                  />
               ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                      <div key={addr.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative group hover:border-green-200 transition-colors">
                          {addr.isDefault && (
                             <span className="absolute top-4 right-4 bg-green-50 text-green-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-green-100">Default</span>
                          )}
                          <h3 className="font-extrabold text-gray-800 mb-1">{addr.name}</h3>
                          <p className="text-xs text-gray-400 mb-4 font-bold tracking-tight">{addr.mobile}</p>
                          <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            {addr.addressLine1}, {addr.addressLine2 && addr.addressLine2 + ','} <br/>
                            {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <div className="mt-6 pt-4 border-t border-gray-50 flex gap-4">
                              {!addr.isDefault && (
                                 <button 
                                   onClick={() => handleSetDefaultAddress(addr.id)}
                                   className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                                 >
                                   Set Default
                                 </button>
                              )}
                              <button className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                              <button className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                          </div>
                      </div>
                  ))}
                </div>
               )}
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-8">
               <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-xl font-black text-gray-800 tracking-tight">Payment Methods</h1>
                    <p className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-widest opacity-80">Securely manage your saved cards.</p>
                  </div>
                  <button onClick={handleComingSoon} className="flex items-center gap-2 text-[11px] font-black uppercase bg-white border border-gray-100 px-5 py-3 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all text-gray-700">
                    <Plus size={16} className="text-green-600" /> Add Card
                  </button>
               </div>
               
               {cards.length === 0 ? (
                  <EmptyState 
                    icon={CreditCard} 
                    title="No Payment Methods" 
                    subtitle="Save your credit or debit cards for faster checkout." 
                    buttonText="Add Your First Card"
                    accentColor="blue"
                  />
               ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cards.map(card => (
                      <div key={card.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 text-white shadow-2xl relative h-48 flex flex-col justify-between overflow-hidden group">
                          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl transition-transform group-hover:scale-150 duration-700"></div>
                          <div className="flex justify-between relative z-10">
                            <div className="w-12 h-9 bg-yellow-400/80 rounded-lg flex items-center justify-center border border-yellow-200/50">
                               <div className="w-10 h-0.5 bg-gray-600/20 translate-y-2"></div>
                            </div>
                            <span className="font-black italic text-xl opacity-60 tracking-widest">{card.cardType || 'VISA'}</span>
                          </div>
                          <p className="text-2xl font-mono tracking-[0.25em] relative z-10 mt-4 leading-none">•••• •••• {card.cardNumber.slice(-4)}</p>
                          <div className="flex justify-between relative z-10 items-end">
                              <div className="max-w-[150px]">
                                <p className="text-[9px] uppercase opacity-40 font-black tracking-widest mb-1">Card Holder</p>
                                <p className="text-xs font-black truncate">{card.cardHolderName}</p>
                              </div>
                              <div className="text-right">
                                {!card.isDefault ? (
                                   <button 
                                     onClick={() => handleSetDefaultCard(card.id)}
                                     className="text-[9px] font-black uppercase bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-lg transition-all"
                                   >
                                     Set Default
                                   </button>
                                ) : (
                                   <span className="text-[9px] font-black uppercase text-green-400 bg-green-400/10 px-2 py-1 rounded-lg">Default</span>
                                )}
                                <div className="mt-1">
                                  <p className="text-[9px] uppercase opacity-40 font-black tracking-widest mb-1">Expires</p>
                                  <p className="text-xs font-black font-mono">{card.expiryDate}</p>
                                </div>
                              </div>
                          </div>
                      </div>
                    ))}
                </div>
               )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

// Reusable Components
const InputGroup = ({ icon: Icon, label, value, onChange, readonly = false }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">{label}</label>
    <div className={`flex items-center gap-4 bg-gray-50 border border-transparent rounded-2xl px-5 py-4 group focus-within:bg-white focus-within:border-green-500 focus-within:shadow-lg focus-within:shadow-green-50 transition-all ${readonly ? 'opacity-60 cursor-not-allowed bg-gray-100/50' : ''}`}>
      <Icon size={18} className="text-gray-400 group-focus-within:text-green-600 transition-colors" />
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange && onChange(e.target.value)}
        readOnly={readonly}
        className="bg-transparent border-none outline-none w-full text-xs font-bold text-gray-700 placeholder-gray-300" 
      />
    </div>
  </div>
);


export default ProfilePage;
