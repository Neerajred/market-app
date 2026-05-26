/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Header from './Components/Header';
import ProductsList from './ProductsList';
import Cart from './Components/Cart';
import Login from './Components/Login';
import Register from './Components/RegisterPage';
import ProfilePage from './Components/ProfilePage';
import Checkout from './Components/Checkout';
import Payment from './Components/Payment';
import OrderConfirmation from './Components/OrderConfirmation';
import OrderTracking from './Components/OrderTracking';
import ProductDetails from './Components/ProductDetails';
import Wishlist from './Components/Wishlist';
import { authAPI } from './services/api';
import { fetchCategories } from './services/productApi';
import './App.css';

const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [username, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Check if user is logged in on mount and fetch categories
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
      setShowModal(true);
      if (storedUsername) {
        setUserName(storedUsername);
      }
    }

    const loadCategories = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedCategory(cats[0]);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (item, d) => {
    let ind = -1;
    cart.forEach((data, index) => {
      if (data.id === item.id) {
        ind = index;
      }
    });
    const tempArr = cart;
    tempArr[ind].quantity += d;
    if (tempArr[ind].quantity === 0) {
      tempArr[ind].quantity = 1;
    }
    setCart([...tempArr]);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await authAPI.login(email, password);
      console.log('User logged in:', data);
      const userName = data.user.fullname || data.user.name || 'User';
      setUserName(userName);
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", userName);
      localStorage.setItem("userId", data.user._id);

      const userProfile = {
        fullName: userName,
        email: data.user.email || email,
        phone: data.user.mobile || '',
      };
      localStorage.setItem("userProfile", JSON.stringify(userProfile));

      setIsLoggedIn(true);
      setShowModal(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.message || 'An error occurred during login');
    }
  };

  const handleProfile = () => {
    // Navigate to profile page
    window.location.href = '/profile';
  };

  const handleLogout = async (navigate) => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    setShowProfile(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("shippingInfo");
    localStorage.removeItem("userProfile");
    setShowModal(false);
    setUserName('');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');

    if (navigate) {
      navigate('/');
    }
  };

  const handleAddClick = (item) => {
    const isPresent = cart.some((product) => product.id === item.id);
    if (isPresent) {
      return;
    }
    setCart([...cart, item]);
  };

  return (
    <Router>
      <div className='h-screen flex flex-col bg-slate-50 overflow-hidden'>
        <Header size={cart.length} handleProfile={handleProfile} setSearchQuery={setSearchQuery} />
        {/* Profile Page rendering removed, using Route instead */}

        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-1 relative overflow-hidden">
                <Navbar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  handleCategoryClick={handleCategoryClick}
                />
                <ProductsList
                  selectedCategory={selectedCategory}
                  handleAddClick={handleAddClick}
                  cart={cart}
                  searchQuery={searchQuery}
                />
              </div>
            }
          />
          <Route
            path="/product/:id"
            element={<ProductDetails handleAddClick={handleAddClick} cart={cart} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/wishlist"
            element={<Wishlist handleAddClick={handleAddClick} cart={cart} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/cart"
            element={<Cart cart={cart} setCart={setCart} handleChange={handleChange} />}
          />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} />}
          />
          <Route
            path="/payment"
            element={<Payment cart={cart} setCart={setCart} isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/order-confirmation"
            element={<OrderConfirmation />}
          />
          <Route
            path="/order-tracking/:orderId"
            element={<OrderTracking />}
          />
          <Route
            path="/login"
            element={
              <Login
                handleLogin={handleLogin}
                error={error}
                showModal={showModal}
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
              />
            }
          />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
