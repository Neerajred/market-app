import { useState, useEffect } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaSearch, FaBell, FaHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { APP_NAME } from '../../utils/constants';

const Header = ({ size, handleProfile, setSearchQuery }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 h-16 flex-none">
      <div className="max-w-[1920px] mx-auto h-full flex justify-between items-center px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center group">
            <span className="text-2xl mr-2 transform group-hover:-rotate-12 transition-transform duration-300">🍎</span>
            <h1 className="font-bold font-heading text-xl sm:text-2xl text-white tracking-tight">
              {APP_NAME}
            </h1>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex items-center relative">
            <input
              type="text"
              placeholder="Search for groceries..."
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="bg-slate-800 text-slate-200 pl-10 pr-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 transition-all focus:w-80"
            />
            <FaSearch className="absolute left-3 text-slate-500" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-slate-400 hover:text-white transition-colors">
            <FaBell className="text-lg" />
          </button>

          <Link to="/wishlist" className="text-slate-400 hover:text-red-400 transition-colors" title="Wishlist">
            <FaHeart className="text-lg" />
          </Link>

          {!isLoggedIn ? (
            <div className="flex gap-4 items-center">
              <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm transition-colors">
                Login
              </Link>
              <Link to="/register">
                <button className="bg-primary-600 hover:bg-primary-500 text-white rounded-full px-5 py-2 transition duration-200 font-bold text-sm shadow-lg shadow-primary-900/20">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={handleProfile}
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                  <CgProfile className="text-xl" />
                </div>
              </div>
            </div>
          )}

          <div className="h-6 w-px bg-slate-700"></div>

          <Link to="/cart" className="group relative">
            <div className="flex cursor-pointer items-center gap-2">
              <div className="relative">
                <FaShoppingCart className="text-slate-300 text-xl group-hover:text-white transition-colors" />
                {size > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-slate-900">
                    {size}
                  </span>
                )}
              </div>
              <span className="hidden lg:block font-medium text-slate-300 group-hover:text-white text-sm transition-colors">Cart</span>
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-slate-200 text-xl" />
            {size > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-slate-900">
                {size}
              </span>
            )}
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="text-slate-200 text-xl focus:outline-none hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 absolute top-16 left-0 right-0 py-4 px-4 space-y-4 shadow-xl border-t border-slate-700 animate-slide-up">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-slate-700 text-slate-200 pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <FaSearch className="absolute left-3 top-3.5 text-slate-500" />
          </div>

          {!isLoggedIn ? (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={toggleMobileMenu}>
                <button className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 hover:bg-slate-600 transition duration-200 font-semibold border border-slate-600">
                  Login
                </button>
              </Link>
              <Link to="/register" onClick={toggleMobileMenu}>
                <button className="w-full bg-primary-600 text-white rounded-xl px-4 py-3 hover:bg-primary-500 transition duration-200 font-semibold shadow-lg">
                  Sign Up
                </button>
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                handleProfile();
                toggleMobileMenu();
              }}
              className="w-full bg-slate-700 text-white rounded-xl px-4 py-3 hover:bg-slate-600 transition duration-200 font-semibold flex items-center justify-center gap-2 border border-slate-600"
            >
              <CgProfile className="text-xl" />
              My Profile
            </button>
          )}
        </div>
      )}
    </header>
  );
}

export default Header