import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, User, LogOut, Package, Heart, BarChart2 } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

const Header = ({ size, username, handleLogout, searchQuery, setSearchQuery }) => { 
   const navigate = useNavigate();
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [userRole, setUserRole] = useState(null);
   const [showProfile, setShowProfile] = useState(false);
   const profileRef = useRef(null);

   const token = localStorage.getItem("token");
   
   useEffect(() => {
     setIsLoggedIn(!!token);
     setUserRole(localStorage.getItem("userRole"));
   }, [token]);

   useEffect(() => {
     const handleClickOutside = (event) => {
       if (profileRef.current && !profileRef.current.contains(event.target)) {
         setShowProfile(false);
       }
     };
     if (showProfile) {
       document.addEventListener('mousedown', handleClickOutside);
     }
     return () => {
       document.removeEventListener('mousedown', handleClickOutside);
     };
   }, [showProfile]);

   const handleLogoutClick = () => {
     handleLogout(navigate);
     setShowProfile(false);
   };

   return (
     <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
       {/* Search Bar - Active */}
       <div className="hidden md:flex items-center flex-1 max-w-md relative group">
         <div className="absolute left-3 text-gray-400 group-focus-within:text-green-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
         </div>
         <input 
            type="text" 
            placeholder="Search products, brands and more..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-green-500 focus:outline-none transition-all text-sm text-gray-600 placeholder-gray-400"
         />
       </div>

       {/* Right Side: Actions */}
       <div className="flex items-center gap-4">
         {/* Wishlist Button - Now Navigates */}
         <Link to="/wishlist">
           <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Wishlist">
              <Heart size={20} />
           </button>
         </Link>

         {/* Cart */}
         <Link to="/cart">
           <button className="relative p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Cart">
             <ShoppingCart size={20} />
             {size > 0 && (
               <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white ring-1 ring-green-100">
                 {size}
               </span>
             )}
           </button>
         </Link>

         <div className="h-6 w-px bg-gray-100 mx-1" />

         {/* User Section */}
         {!isLoggedIn ? (
           <div className="flex gap-2">
             <Link to="/login">
               <button className="text-sm font-bold text-gray-600 hover:text-green-600 px-3 py-2 transition-colors">
                 Login
               </button>
             </Link>
             <Link to="/register">
               <button className="bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 hover:-translate-y-0.5 transition-all">
                 Register
               </button>
             </Link>
           </div>
         ) : (
           <div ref={profileRef} className="relative">
             <button 
               onClick={() => setShowProfile(!showProfile)}
               className={`flex items-center gap-2 p-1 rounded-xl transition-all ${showProfile ? 'bg-green-50 ring-1 ring-green-100' : 'hover:bg-gray-50'}`}
             >
               <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white shadow-sm border border-white">
                 <User size={18} />
               </div>
               <div className="hidden sm:block text-left pr-2">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-none mb-1">Hello,</p>
                 <p className="text-xs font-bold text-gray-700 leading-none truncate max-w-[80px]">{username || 'User'}</p>
               </div>
             </button>

             {/* Minimal Profile Dropdown */}
             {showProfile && (
               <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 animate-fadeIn z-50">
                 <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">My Account</p>
                    <p className="text-sm font-black text-gray-800 truncate">{username}</p>
                 </div>
                 
                 {userRole === 'admin' && (
                    <ProfileItem 
                      icon={<BarChart2 size={16} />} 
                      label="Admin Dashboard" 
                      onClick={() => { navigate('/admin'); setShowProfile(false); }} 
                    />
                 )}
                 
                 <ProfileItem icon={<Package size={16} />} label="My Orders" onClick={() => { navigate('/orders'); setShowProfile(false); }} />
                 <ProfileItem icon={<Heart size={16} />} label="Wishlist" onClick={() => { navigate('/wishlist'); setShowProfile(false); }} />
                 <ProfileItem icon={<User size={16} />} label="My Profile" onClick={() => { navigate('/profile'); setShowProfile(false); }} />
                 
                 <div className="border-t border-gray-50 mt-1 pt-1">
                    <button 
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                 </div>
               </div>
             )}
           </div>
         )}
       </div>
     </header>
   );
}

const ProfileItem = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-colors group"
  >
    <span className="text-gray-400 group-hover:text-green-500 transition-colors">{icon}</span>
    {label}
  </button>
)

export default Header;
